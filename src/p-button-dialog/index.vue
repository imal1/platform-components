<!--
 * @Author: imali
 * @Date: 2022-03-10 01:10:22
 * @LastEditTime: 2022-03-29 11:02:49
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
import { omit, keys, isFunction, pickBy, isBoolean } from "lodash";

export default {
	name: "p-button-dialog",
	props: {
		button: {
			type: Object,
			required: true,
		},
	},
	data() {
		return {
			visible: isBoolean(this.$attrs.visible) ? this.$attrs.visible : false,
		};
	},
	computed: {
		buttonEvents() {
			const events = pickBy(this.button, isFunction);
			events.click = async () => {
				if (click) {
					await events.click();
				}
				this.visible = true;
			};
			return events;
		},
		buttonAttrs() {
			return omit(this.button, keys(this.buttonEvents));
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
