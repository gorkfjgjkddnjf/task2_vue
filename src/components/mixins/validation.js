let validation = {
    data(){
        return{
            errors: [],
            value: [],
            flagP: true,
            flagE: true,
            flagT: true,
            validatorText: /^([^#$%^&!'|/"\\*]+)$/,
            validatorEmail: /^[-._a-zA-Z0-9]+@(?:[a-z]+\.)+[a-z]{2,3}$/,
            validatorPass: /(?=.*[0-9])(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z!@#$%^&*]{6,}/g
        }
    },
    computed:{
        // checkSaveBtn(){
        //     let input = document.querySelectorAll('input')
        //     for(let i = 0; i<input.length; i++){
        //         if(input[i].value && (this.validatorText.test(input[i].value) || this.validatorPass.test(input[i].value) || this.validatorEmail.test(input[i].value))){
        //            return false
        //         }
        //         else {
        //            return true                    
        //         }
        //     }
        // },
    },
    methods:{
        checkSaveBtn(){
            let input = document.querySelectorAll('input')
            for(let i = 0;i<input.length;i++){
                //if(input[i].value && (this.validatorText.test(input[i].value) || this.validatorPass.test(input[i].value) || this.validatorEmail.test(input[i].value))){
                if(input[i].validity.valid){ 
                    console.log(1) 
                    this.dis = false
                }
                else {
                    console.log(2)
                    this.dis = true
                    break;
                }
            }
            //this.value.push(value)
            // if(input.length == this.value.length){
            //     this.dis = false
            // }
            // else{
            //     this.dis = true
            // }
            console.log(this.value)
        },
        checkFill(){
            let input = document.querySelectorAll('input')
            input.forEach(element =>{
                // if(element.value){
                //     this.value.push(element.value)
                // }
                element.addEventListener('input', this.valid)
            })
            //console.log(this.value)
        },
        valid(event){
            let input = event.target
            let mEmail = 'enter valid Email'
            let mPass = 'enter valid Password'
            let mText = 'enter valid Name'
            let validatorText = /^([^#$%^&!'|/"\\*]+)$/
            let validatorEmail = /^[-._a-zA-Z0-9]+@(?:[a-z]+\.)+[a-z]{2,3}$/;
            let validatorPass = /(?=.*[0-9])(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z!@#$%^&*]{6,}/g
            if(input.type == 'email'){
                if(this.flagE && !validatorEmail.test(input.value)){
                    this.errors.push(mEmail)
                    console.log(this.errors)
                    this.flagE = false
                }else if(validatorEmail.test(input.value) && !this.flagE){
                    let index = this.errors.indexOf(mEmail)
                    this.errors.splice(index,1)
                    this.flagE = true
                    this.checkSaveBtn()
                }
            }
            if(input.type == 'password'){
                
                if(this.flagP && !validatorPass.test(input.value)){
                    this.errors.push(mPass)
                    this.flagP = false
                }else if(!this.flagP && validatorPass.test(input.value)){
                    let index = this.errors.indexOf(mPass)
                    this.errors.splice(index,1)
                    this.flagP = true
                    this.checkSaveBtn()
                }
            }
            if(input.type == 'text'){
                if(this.flagT && !validatorText.test(input.value)){
                    this.errors.push(mText)
                    console.log(this.errors)
                    this.flagT = false
                }else if(validatorText.test(input.value) && !this.flagT){
                    let index = this.errors.indexOf(mText)
                    this.errors.splice(index,1)
                    this.flagT = true
                    this.checkSaveBtn()
                }
            }
            this.checkSaveBtn()
            console.log(input.value)
            console.log(this.errors)
        }
    },
    mounted(){
        
    }

}

export default validation