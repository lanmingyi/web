import FormBuild from './index.vue'

FormBuild.install = function(Vue){
  Vue.component(FormBuild.name, FormBuild)
}

// app.component(FormBuild.name, FormBuild)

export default FormBuild