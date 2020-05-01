import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

let store = new Vuex.Store({
    state:{
        JSON_OBJ: null
    },
    actions:{
        GET_JSON(){
            fetch('./json/signin.json')
            .then((response) => response.text())
            .then((jsonObj) =>{
                console.log(jsonObj)
            })
        }
    },
    mutations:{

    },
    getters:{

    }
})

export default store
