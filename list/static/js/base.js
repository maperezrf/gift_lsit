btns = Array.from(document.getElementsByClassName('btn-seleccionar'))
btns.forEach(btn => {
    btn.addEventListener('click', e => {
        divFather = btn.parentElement
        giftName = Array.from(divFather.getElementsByTagName("p"))[0].innerText
        show_confirmation(giftName, btn.id)
    })
});

function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

function show_confirmation(giftName, id) {
    Swal.fire({
        title: '¡Excelente elección!',
        html: `Vas a elegir: <b>${giftName}.</b><br><br>Por favor, dinos quién eres:`,
        input: 'text',
        inputPlaceholder: 'Escribe tu nombre aquí...',
        icon: 'info',
        inputAttributes: {
            maxlength: "60",
            autocapitalize: "off",
            autocorrect: "off"
        },
        showCancelButton: true,
        confirmButtonText: 'Confirmar regalo',
        cancelButtonText: 'Volver',
        inputValidator: (value) => {
            if (!value) {
                return '¡Necesitamos tu nombre para anotar el regalo!';
            }
        }
    }).then((result) => {
        if (result.isConfirmed) {
            const nombrePersona = result.value;
            fetch('/list/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': getCookie('csrftoken')
                },
                body: JSON.stringify({
                    regalo: giftName,
                    persona: nombrePersona,
                    id: id
                })
            })
            .then(response => {
                if (response.status === 200) {
                    // Caso OK
                    Swal.fire(
                        '¡Anotado!',
                        `Gracias <strong>${nombrePersona}</strong>, el regalo ha sido reservado.`,
                        'success'
                    ).then(() => location.reload());
                } else if (response.status === 204) {
                    // Caso regalo ya seleccionado
                    Swal.fire(
                        '¡Ups!',
                        'Este regalo ya ha sido seleccionado por otra persona.',
                        'warning'
                    ).then(() => location.reload());
                } else {
                    // Otros errores
                    Swal.fire(
                        'Error',
                        'Hubo un problema al intentar reservar el regalo. Intenta de nuevo.',
                        'error'
                    );
                }
            })
            .catch(() => {
                Swal.fire(
                    'Error',
                    'No se pudo conectar con el servidor. Intenta más tarde.',
                    'error'
                );
            });
        }
    });
}
