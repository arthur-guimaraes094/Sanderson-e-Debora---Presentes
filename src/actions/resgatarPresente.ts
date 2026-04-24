'use server'

import { supabaseAdmin } from '@/lib/supabase'
import { revalidatePath } from 'next/cache'

export async function resgatarPresente(formData: FormData) {
  try {
    const presente_id = formData.get('presente_id') as string
    const nome = formData.get('nome') as string
    const foto = formData.get('foto') as File
    const comprovante = formData.get('comprovante') as File

    if (!presente_id || !nome || !foto || !comprovante) {
      return { error: 'Por favor, preencha todos os campos e anexe os arquivos.' }
    }

    if (!(foto instanceof File) || foto.size === 0) {
      return { error: 'A foto é obrigatória e precisa ser um arquivo válido.' }
    }

    if (!(comprovante instanceof File) || comprovante.size === 0) {
      return { error: 'O comprovante é obrigatório e precisa ser um arquivo válido.' }
    }

    // 1. Upload das Imagens para o Storage
    const timestamp = Date.now()
    const fotoExt = foto.name.split('.').pop()
    const compExt = comprovante.name.split('.').pop()

    const fotoPath = `${timestamp}_${Math.random().toString(36).substring(7)}.${fotoExt}`
    const compPath = `${timestamp}_${Math.random().toString(36).substring(7)}.${compExt}`

    const { data: fotoData, error: fotoError } = await supabaseAdmin.storage
      .from('fotos_convidados')
      .upload(fotoPath, foto)

    if (fotoError) {
      console.error('Erro upload foto:', fotoError)
      return { error: 'Falha ao fazer upload da foto.' }
    }

    const { data: compData, error: compError } = await supabaseAdmin.storage
      .from('comprovantes')
      .upload(compPath, comprovante)

    if (compError) {
      console.error('Erro upload comprovante:', compError)
      // Rollback da foto
      await supabaseAdmin.storage.from('fotos_convidados').remove([fotoPath])
      return { error: 'Falha ao fazer upload do comprovante.' }
    }

    // Obter URLs públicas (A foto é pública, comprovante não precisamos da URL pública, mas vamos salvar o path para acessar via admin)
    const { data: { publicUrl: foto_convidado_url } } = supabaseAdmin.storage
      .from('fotos_convidados')
      .getPublicUrl(fotoPath)

    // Para o comprovante, salvamos apenas o path no banco de dados para os noivos verem depois
    const comprovante_url = compPath

    // 2. Inserção no Banco de Dados
    const { error: insertError } = await supabaseAdmin
      .from('resgates')
      .insert({
        presente_id,
        nome_convidado: nome,
        foto_convidado_url,
        comprovante_url,
      })

    if (insertError) {
      console.error('Erro insert resgate:', insertError)
      
      // Rollback das imagens do Storage se falhou no banco
      await supabaseAdmin.storage.from('fotos_convidados').remove([fotoPath])
      await supabaseAdmin.storage.from('comprovantes').remove([compPath])

      // Verifica se o erro é de restrição única (código 23505 no postgresql)
      if (insertError.code === '23505') {
        return { error: 'Ops! Alguém foi mais rápido e acabou de resgatar este presente. Por favor, escolha outro.' }
      }

      return { error: 'Erro ao resgatar o presente. Tente novamente mais tarde.' }
    }

    // Revalida a página principal para atualizar a lista
    revalidatePath('/')

    return { success: true }
  } catch (error) {
    console.error('Erro inesperado:', error)
    return { error: 'Ocorreu um erro inesperado.' }
  }
}
