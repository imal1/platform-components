<template>
	<div>
		<el-table
			ref="p-table"
			:stripe="isNil($attrs.stripe) ? true : $attrs.stripe"
			:border="isNil($attrs.border) ? true : $attrs.border"
			:default-expand-all="
				isNil($attrs.defaultExpandAll) ? true : $attrs.defaultExpandAll
			"
			:data="data"
			v-bind="$attrs"
			v-on="$listeners"
		>
			<template v-for="(col, index) in columns">
				<el-table-column
					v-if="!col.prop && (col.type === 'index' || col.type === 'selection')"
					:key="col.prop || index"
					align="center"
					v-bind="col"
				/>
				<el-table-column
					v-else-if="col.children"
					:key="col.prop || index"
					align="center"
					v-bind="col"
				>
					<el-table-column
						v-for="(c, i) in col.children"
						:key="c.prop || `${index}${i}`"
						header-align="left"
						v-bind="c"
					>
						<template v-if="!c.formatter" #default="{ row, column, $index }">
							<slot :name="c.prop" :row="row" :column="column" :index="$index">
								{{ isNil(row[c.prop]) ? c.empty : row[c.prop] }}
							</slot>
						</template>
					</el-table-column>
				</el-table-column>
				<el-table-column v-else :key="col.prop || index" v-bind="col">
					<template v-if="!col.formatter" #default="{ row, column, $index }">
						<slot :name="col.prop" :row="row" :column="column" :index="$index">
							{{ isNil(row[col.prop]) ? col.empty : row[col.prop] }}
						</slot>
					</template>
					<template
						v-if="!col.label && col.header"
						#header="{ column, $index }"
					>
						<slot
							:name="`${col.prop}-header`"
							:column="column"
							:index="$index"
						/>
					</template>
				</el-table-column>
			</template>
		</el-table>
		<el-pagination
			v-if="pagination"
			background
			v-bind="paginAttrs"
			v-on="paginEvents"
		/>
	</div>
</template>
<script>
import { computed, defineComponent } from "@vue/composition-api";
import * as lodash from "lodash";

const { pickBy, omit, keys, isFunction, isNil } = lodash;

export default defineComponent({
	props: {
		columns: {
			type: Array,
			required: true,
		},
		data: {
			type: Array,
			required: false,
			default() {
				return [];
			},
		},
		pagination: {
			type: Object,
			required: false,
			default() {
				return null;
			},
		},
	},
	setup(props) {
		const paginEvents = computed(() => pickBy(props.pagination, isFunction));
		const paginAttrs = computed(() =>
			omit(props.pagination, keys(paginEvents.value))
		);

		return {
			paginEvents,
			paginAttrs,
			isNil,
		};
	},
});
</script>
<style lang="scss" scoped>
::v-deep .el-pagination {
	margin-top: 8px;
	text-align: right;
}
::v-deep .el-table {
	.el-table-row {
		height: 40px;
		font-size: 14px;
	}
	.el-table__row--level-0 {
		font-size: 15px;
		height: 42px;
		font-weight: bold;
		color: #58c1ee;
	}
	.el-table__row--level-1 {
		font-weight: 500;
		color: #58c1ee;
	}
}
</style>
