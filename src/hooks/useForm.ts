import {ref} from 'vue'
import {useBoolean} from "@/hooks/useBoolean"
export function useForm(){
    const {bool, setTrue} = useBoolean()

    /** 新增*/
    function handleAdd(formRef){
        // formRef.value.



    }
    return {
        handleAdd
    }
}