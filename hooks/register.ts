import type { Register } from 'claude-code'

export const register: Register = on => {
    let hadError = false
    let hadDeny = false

    // Al iniciar un turno, resetea los flags
    on('turn.start', ($, e, next) => {
        hadError = false
        hadDeny = false
        return next(e)
    })

    // Cuando se verifica permiso de una herramienta (permiso denegado)
    on('tool.check', async ($, e, next) => {
        const result = await next(e)

        if (result.decision === 'deny') {
            hadDeny = true
            $.ui.toast('🔐 Permiso denegado', { timeoutMs: 3500 })

            try {
                await $.audio.play({ asset: 'fx/permiso.mp3' })
            } catch {
                // Sin reproductor disponible
            }
        }

        return result
    })

    // Cuando una herramienta devuelve error
    on('tool.call', async ($, e, next) => {
        const result = await next(e)

        if (result.isError) {
            hadError = true
            $.ui.toast('❌ Error en la herramienta', { timeoutMs: 3500 })

            try {
                await $.audio.play({ asset: 'fx/error.mp3' })
            } catch {
                // Sin reproductor disponible
            }
        }

        return result
    })

    // Cuando Claude termina un turno (solo si NO hubo error ni deny)
    on('turn.complete', async ($, e, next) => {
        if (!hadError && !hadDeny) {
            $.ui.toast('🎉 ¡Listo! Claude terminó', { timeoutMs: 4000 })

            try {
                await $.audio.play({ asset: 'fx/exito.mp3' })
            } catch {
                // Sin reproductor disponible
            }
        }

        return next(e)
    })
}
