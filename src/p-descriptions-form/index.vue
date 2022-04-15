<!--
 * @Author: imali
 * @Date: 2022-02-21 20:03:59
 * @LastEditTime: 2022-04-15 11:20:55
 * @LastEditors: imali
 * @Description:
-->
<template>
	<el-form
		ref="p-descriptions-form"
		class="p-descriptions-form"
		inline
		:model="value"
		v-bind="$attrs"
		v-on="$listeners"
	>
		<el-descriptions size="medium" border v-bind="$attrs.descriptions">
			<template v-for="item in formItems">
				<el-descriptions-item
					:key="item.columnAttrs['prop']"
					:label="item.label"
					v-bind="item.descriptions"
				>
					<template slot="label">
						<i v-if="item.icon" :class="item.icon"></i>
						{{ item.label }}
					</template>
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
						<slot v-else :name="item.columnAttrs['prop']" />
					</el-form-item>
				</el-descriptions-item>
			</template>
		</el-descriptions>
	</el-form>
</template>
<script>
import { omit, keys, isFunction, pickBy } from "lodash";
import "./index.scss";

export default {
	name: "p-descriptions-form",
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
	computed: {
		formItems() {
			return this.items.map((item) => {
				const { content, label, icon, descriptions, ...otherItem } = item;
				const columnEvents = pickBy(otherItem, isFunction);
				const columnAttrs = omit(otherItem, keys(columnEvents));
				item = {
					content,
					label,
					icon,
					descriptions,
					columnAttrs,
					columnEvents,
				};
				// 获取输入框属性
				if (item.content?.is) {
					const { is, ...otherContent } = content;
					const contentEvents = pickBy(otherContent, isFunction);
					const contentAttrs = omit(otherContent, keys(contentEvents));
					item.content = { is, contentEvents, contentAttrs };
				}
				return item;
			});
		},
	},
};
</script>
