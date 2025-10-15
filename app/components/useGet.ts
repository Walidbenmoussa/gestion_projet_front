export async function useGet(url,IP)
{
const toast= useToast()
 try {
        const response = await $fetch(`${IP.value}url`, {
            method: 'GET',
            credentials: 'include',
        })
        useRouter().push('/')
        toast.add({ description: response, color: 'primary', progress: false, class: 'bg-primary' })
    }
    catch (error) {

        toast.add({ description: error.data.detail || 'echec de recuperation', color: 'primary', progress: false, class: 'bg-error' })
    }



}