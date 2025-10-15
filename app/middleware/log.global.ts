import Dash_projects from "~/pages/dash_projects.vue"

export default defineNuxtRouteMiddleware((to, from) => {
    const router = useRouter()
    const user= useCookie('user')


    try{
        if (to.path !== '/login' ) {
            if( ! user.value?.id ){
                return router.push('/login')
            }
            else if(to.path == '/') {
            return router.push('/dash_projects')
            

        } 
            
        }
    
        
    }
        catch(error) {
            return router.push('/login')
        }

    
    
})
