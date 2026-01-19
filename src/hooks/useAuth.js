import { useEffect, useState } from "react"
import { supabase } from "../lib/supabase"

export function useAuth() {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  

  async function fetchProfile(user) {
  const { data } = await supabase
    .from("users")
    .select("*")
    .eq("id", user.id)
    .maybeSingle()

  // 👈 SI EXISTE, listo
  if (data) {
    setProfile(data)
    return
  }

  // 👈 SI NO EXISTE, CREAR
  const { data: newProfile, error: insertError } =
    await supabase
      .from("users")
      .insert({
        id: user.id,
        email: user.email,
        name: user.email.split("@")[0],
        role: null,
      })
      .select()
      .single()

  if (insertError) {
    console.error("Error creando perfil:", insertError)
    return
  }

  setProfile(newProfile)
}


  useEffect(() => {
    // sesión inicial
    supabase.auth.getSession().then(({ data }) => {
      const sessionUser = data.session?.user ?? null
      setUser(sessionUser)

      if (sessionUser) fetchProfile(sessionUser)

      setLoading(false)
    })

    // listener auth
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      const sessionUser = session?.user ?? null
      setUser(sessionUser)

      if (sessionUser) fetchProfile(sessionUser)
      else setProfile(null)
    })

    return () => subscription.unsubscribe()
  }, [])

  return { user, profile, loading }
}
