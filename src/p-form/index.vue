<!--
 * @Description:
 * @version:
 * @Author: imali
 * @Date: 2021-07-14 13:30:41
 * @LastEditors: imali
 * @LastEditTime: 2022-03-28 16:21:38
-->

<template>
	<el-form ref="p-form" :model="value" v-bind="$attrs" v-on="$listeners">
		<template v-for="item in formItems">
			<el-form-item
				:key="item.columnAttrs['prop']"
				v-bind="item.columnAttrs"
				v-on="item.columnEvents"
			>
				<component
					:is="item.content.is"
					v-if="item.content && item.content.is"
					v-model="value[item.columnAttrs['prop']]"
					v-bind="item.content.contentAttrs"
					v-on="item.content.contentEvents"
				>
					<slot :name="item.columnAttrs['prop']" />
				</component>
				<template v-else-if="isArray(item.content)">
					<component
						v-for="(c, i) in item.content"
						:key="i"
						:is="c.is"
						v-model="value[item.columnAttrs['prop']]"
						v-bind="c.contentAttrs"
						v-on="c.contentEvents"
					>
						{{ c.text }}
					</component>
				</template>
				<slot v-else :name="item.columnAttrs['prop']" />
			</el-form-item>
		</template>
	</el-form>
</template>

<script>
import { computed, defineComponent } from "@vue/composition-api";
import * as lodash from "lodash";
import DatePicker from "../p-date-picker/index.vue";

const { omit, keys, isFunction, pickBy, isArray } = lodash;

export default defineComponent({
	name: "p-form",
	components: { DatePicker },
	props: {
		items: {
			type: Array,
			required: true,
		},
		value: {
			type: Object,
			required: false,
			default: () => ({}),
		},
	},
	setup(props) {
		// 获取各栏属性
		const formItems = computed(() =>
			props.items.map((item) => {
				const { content, ...otherItem } = item;
				const columnEvents = pickBy(otherItem, isFunction);
				const columnAttrs = omit(otherItem, keys(columnEvents.value));
				item = { content, columnAttrs, columnEvents };
				// 获取输入框属性
				if (item.content?.is) {
					const { is, ...otherContent } = content;
					const contentEvents = pickBy(otherContent, isFunction);
					const contentAttrs = omit(otherContent, keys(contentEvents.value));
					item.content = { is, contentEvents, contentAttrs };
				} else if (isArray(item.content)) {
					item.content.forEach((c, i) => {
						const { is, text, ...otherContent } = c;
						const contentEvents = pickBy(otherContent, isFunction);
						const contentAttrs = omit(otherContent, keys(contentEvents.value));
						item.content[i] = { is, text, contentEvents, contentAttrs };
					});
				}
				return item;
			})
		);

		return {
			formItems,
			isArray,
		};
	},
});
</script>
<style scoped>
::v-deep .el-range-separator {
	min-width: 18px;
}
</style>
