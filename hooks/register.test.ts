import { test, expect } from 'claude-code/testing'

// El mod no debe bloquear ni cambiar el turno: solo avisa.
test('al terminar un turno, el mod deja pasar el evento sin error', async ($, on) => {
    // Respuesta base del motor: sin ella el evento no tiene quién responda.
    on('turn.complete', ($, e) => ({ text: e.answer }))

    const result = await $.turn.complete({
        reason: 'answer',
        answer: 'Listo.',
        durationMs: 1200,
        isAborted: false,
        turnId: 'turno-de-prueba',
    })

    expect(result).toBeDefined()
})
