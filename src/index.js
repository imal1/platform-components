/*
 * @Author: imali
 * @Date: 2022-03-28 14:02:58
 * @LastEditTime: 2022-03-29 10:39:34
 * @LastEditors: imali
 * @Description:
 */
import PForm from "./p-form/index.vue";
import PTable from "./p-table/index.vue";
import PDatePicker from "./p-date-picker/index.vue";
import PButtonDialog from "./p-button-dialog/index.vue";
import PDescriptionsForm from "./p-descriptions-form/index.vue";

const components = [
	PForm,
	PTable,
	PDatePicker,
	PButtonDialog,
	PDescriptionsForm,
];

// will install the plugin only once
const install = function (Vue) {
	components.forEach((component) => {
		Vue.component(component.name, component);
	});
};

if (typeof window !== "undefined" && window.Vue) {
	install(window.Vue);
}

export default {
	install,
	PForm,
	PTable,
	PDatePicker,
	PButtonDialog,
	PDescriptionsForm,
};
