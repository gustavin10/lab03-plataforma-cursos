// Funções utilitárias de interface compartilhadas entre controllers

export function mostrarErro(id, msg) {
  const el = document.getElementById(id);
  if (!el) return;
  el.textContent = msg;
  el.classList.remove('d-none');
}

export function limparErro(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.textContent = '';
  el.classList.add('d-none');
}

export function fecharModal(id) {
  const el = document.getElementById(id);
  if (!el) return;
  const modal = bootstrap.Modal.getInstance(el);
  if (modal) modal.hide();
}

export function popularSelect(selectId, lista, textoFn, valorFn, placeholder) {
  const sel = document.getElementById(selectId);
  if (!sel) return;
  sel.innerHTML =
    `<option value="">${placeholder || 'Selecione...'}</option>` +
    lista.map(i => `<option value="${valorFn(i)}">${textoFn(i)}</option>`).join('');
}

export function estrelas(nota) {
  return '★'.repeat(nota) + '☆'.repeat(5 - nota);
}
