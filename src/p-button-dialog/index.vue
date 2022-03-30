<!--
 * @Author: imali
 * @Date: 2022-03-10 01:10:22
 * @LastEditTime: 2022-03-30 13:24:26
 * @LastEditors: imali
 * @Description:
-->
<template>
	<span class="p-button-dialog" ref="p-button-dialog">
		<el-button v-if="button" v-bind="buttonAttrs" v-on="buttonEvents">
			<template v-if="button.label">
				{{ button.label }}
			</template>
			<template v-else>
				<slot name="button" />
			</template>
		</el-button>
		<slot v-else name="trigger" />
		<el-dialog v-bind="$attrs" v-on="$listeners" :visible.sync="dialogVisible">
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
import { omit, keys, isFunction, pickBy } from "lodash";

export default {
	name: "p-button-dialog",
	props: {
		button: {
			type: Object,
			default: () => null,
		},
		visible: {
			type: Boolean,
			default: () => false,
		},
	},
	data() {
		return {
			dialogVisible: false,
		};
	},
	computed: {
		buttonEvents() {
			const events = pickBy(this.button, isFunction);
			const doClick = events.click;
			events.click = async () => {
				if (doClick) {
					await doClick();
				}
				this.dialogVisible = true;
			};
			return events;
		},
		buttonAttrs() {
			return omit(this.button, keys(this.buttonEvents));
		},
	},
	watch: {
		visible: {
			handler(newVisible) {
				this.dialogVisible = newVisible;
			},
			immediate: true,
		},
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
