import Vue from 'vue'
import Router from 'vue-router'
import mainForm from './components/main-forms'
import save from './components/save'

Vue.use(Router)

let router = new Router({
    routes:[
        {
            path: '/',
            name: 'main',
            component: mainForm,
        },
        {
            path: '/save',
            name: 'save',
            component: save,
            props: true
        }
    ]
})

export default router