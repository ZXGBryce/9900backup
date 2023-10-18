import { useNavigate } from 'react-router-dom'

export function useCustomNavigate () {
    const navigate = useNavigate()

    function handleNavigate (path){
        navigate(`/${path}`)
    }

    return handleNavigate
}

export function logout () {
    localStorage.clear()
}