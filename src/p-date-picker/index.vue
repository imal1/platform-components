<!--
 * @Author: imali
 * @Date: 2021-10-14 09:35:17
 * @LastEditTime: 2022-03-28 16:21:15
 * @LastEditors: imali
 * @Description:
-->
<template>
	<div ref="p-date-picker">
		<el-date-picker
			v-model="valueModel"
			v-bind="{
				style: type === 'quarter' ? { width: '116px' } : undefined,
				type: type === 'quarter' ? 'year' : type,
				valueFormat,
				placeholder: '请选择日期',
				rangeSeparator: '至',
				startPlaceholder: '开始日期',
				endPlaceholder: '结束日期',
				...$attrs,
			}"
			v-on="$listeners"
		/>
		<el-select
			v-if="type === 'quarter'"
			v-model="quarterModel"
			style="width: 100px"
		>
			<el-option
				v-for="(q, i) in quarterNumList"
				:key="q"
				:label="`第${q}季度`"
				:value="`${i + 1}`"
			/>
		</el-select>
	</div>
</template>

<script>
import {
	defineComponent,
	ref,
	watch,
	inject,
	computed,
} from "@vue/composition-api";
import * as dayjs from "dayjs";

const DEFAULT_FORMATS = {
	date: "yyyy-MM-dd",
	month: "yyyy-M",
	datetime: "yyyy-MM-dd HH:mm:ss",
	time: "HH:mm:ss",
	timerange: "HH:mm:ss",
	daterange: "yyyy-MM-dd",
	monthrange: "yyyy-M",
	datetimerange: "yyyy-MM-dd HH:mm:ss",
	year: "yyyy",
	quarter: "yyyy",
};

export default defineComponent({
	name: "p-date-picker",
	inheritAttrs: false,
	props: {
		type: {
			type: String,
			required: true,
		},
		value: {
			type: String,
			default: () => "",
		},
	},
	setup(props, ctx) {
		const valueFormat = computed(() => DEFAULT_FORMATS[props.type]);
		const pickerType = computed(() => props.type);
		const quarterModel = ref(
			(pickerType.value === "quarter" && props.value.match("q")
				? props.value.split("q")[1]
				: dayjs(props.value).quarter().toString()) || "1"
		);
		const valueModel = ref(props.value);
		const elForm = inject < any > "elForm";
		const elFormItem = inject < any > "elFormItem";

		watch(
			[valueModel, pickerType, quarterModel],
			([newValue, newType, newQuarter], [oldValue, oldType, oldQuarter]) => {
				const yearVal = dayjs(newValue.split("q")[0]).format("YYYY");

				if (newQuarter !== oldQuarter) {
					newValue = `${yearVal}q${newQuarter}`;
				}

				if (newValue !== oldValue && newType === "quarter") {
					newValue = `${yearVal}q${newQuarter}`;
				}

				if (oldType !== newType) {
					switch (newType) {
						case "year": {
							newValue = yearVal;
							break;
						}
						case "quarter": {
							newValue = `${yearVal}q${newQuarter}`;
							break;
						}
						case "month": {
							newValue = `${yearVal}-01`;
							break;
						}
						case "date": {
							newValue = `${yearVal}-01-01`;
							break;
						}
						default:
							break;
					}
					valueModel.value = newValue;
				}

				if (elForm && elFormItem) {
					elForm.model[elFormItem.prop] = newValue;
				} else {
					ctx.emit("update:value", newValue);
				}
			}
		);

		const quarterNumList = ["一", "二", "三", "四"];

		return {
			valueModel,
			valueFormat,
			quarterModel,
			quarterNumList,
		};
	},
});
</script>
