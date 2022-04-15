<template>
	<fragment>
		<el-table
			ref="p-table"
			class="p-table"
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
			class="p-pagination"
			v-if="pagination"
			background
			v-bind="paginAttrs"
			v-on="paginEvents"
		/>
	</fragment>
</template>
<script>
import { Fragment } from "vue-fragment";
import { pickBy, omit, keys, isFunction, isNil } from "lodash";
import "./index.scss";

export default {
	components: { Fragment },
	name: "p-table",
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
	data() {
		return { isNil };
	},
	computed: {
		paginEvents() {
			return pickBy(this.pagination, isFunction);
		},
		paginAttrs() {
			return omit(this.pagination, keys(this.paginEvents));
		},
	},
};
</script>
