import FormPreview from './index.vue'

FormPreview.install = function(Vue){
  Vue.component(FormPreview.name, FormPreview)
}
export default FormPreview