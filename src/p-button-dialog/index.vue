<!--
 * @Author: imali
 * @Date: 2022-03-10 01:10:22
 * @LastEditTime: 2022-03-28 16:20:59
 * @LastEditors: imali
 * @Description: 
-->
<template>
	<span class="p-button-dialog" ref="p-button-dialog">
		<el-button v-bind="buttonAttrs" v-on="buttonEvents">
			<template v-if="button.label">
				{{ button.label }}
			</template>
			<template v-else>
				<slot name="button" />
			</template>
		</el-button>
		<el-dialog v-bind="$attrs" v-on="$listeners" :visible.sync="visible">
			<template v-if="!$attrs.title" #title>
				<slot name="title" />
			</template>
			<slot />
			<template #footer>
				<slot name="footer" />
			</template>
		</el-dialog>
	</span>
</template>
<script>
import { reactive, ref } from "@vue/composition-api";
import * as lodash from "lodash";

const { omit, keys, isFunction, pickBy, isBoolean } = lodash;

export default {
	name: "p-button-dialog",
	props: {
		button: {
			type: Object,
			required: true,
		},
	},
	setup(props, ctx) {
		const visible = ref(
			isBoolean(ctx.attrs.visible) ? ctx.attrs.visible : false
		);
		const buttonProps = reactive(props.button);
		const buttonEvents = pickBy(buttonProps, isFunction);
		const buttonAttrs = omit(buttonProps, keys(buttonEvents));
		const { click } = buttonEvents;

		buttonEvents.click = async () => {
			if (click) {
				await click();
			}
			visible.value = true;
		};

		if (!ctx.slots.title) {
			ctx.attrs["title"] = ctx.attrs["title"] || buttonProps.label;
		}

		return {
			visible,
			buttonAttrs,
			buttonEvents,
		};
	},
};
</script>
<style scoped>
.p-button-dialog {
	display: inline-block;
}
.el-button + .p-button-dialog {
	margin-left: 10px;
}
</style>
