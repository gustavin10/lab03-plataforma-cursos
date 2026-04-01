// helpers gerais

function validarEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function mostrarErro(id, msg) {
  const el = document.getElementById(id);
  if (!el) return;
  el.textContent = msg;
  el.classList.remove('d-none');
}

function limparErro(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.textContent = '';
  el.classList.add('d-none');
}

function fecharModal(id) {
  const el = document.getElementById(id);
  if (!el) return;
  const modal = bootstrap.Modal.getInstance(el);
  if (modal) modal.hide();
}

function popularSelect(selectId, lista, textoFn, valorFn, placeholder) {
  const sel = document.getElementById(selectId);
  if (!sel) return;
  sel.innerHTML = `<option value="">${placeholder || 'Selecione...'}</option>` +
    lista.map(i => `<option value="${valorFn(i)}">${textoFn(i)}</option>`).join('');
}

function estrelas(nota) {
  return '★'.repeat(nota) + '☆'.repeat(5 - nota);
}

// --- usuarios ---

function salvarUsuario() {
  const nome  = document.getElementById('usr-nome').value.trim();
  const email = document.getElementById('usr-email').value.trim();
  const senha = document.getElementById('usr-senha').value.trim();
  limparErro('usr-erro');

  if (!nome)  return mostrarErro('usr-erro', 'Nome é obrigatório.');
  if (!email) return mostrarErro('usr-erro', 'E-mail é obrigatório.');
  if (!validarEmail(email)) return mostrarErro('usr-erro', 'Formato de e-mail inválido.');
  if (!senha) return mostrarErro('usr-erro', 'Senha é obrigatória.');

  const emailJaUsado = DB.usuarios.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (emailJaUsado) return mostrarErro('usr-erro', 'Já existe um usuário com este e-mail.');

  DB.usuarios.push(new Usuario(nome, email, senha));

  document.getElementById('usr-nome').value  = '';
  document.getElementById('usr-email').value = '';
  document.getElementById('usr-senha').value = '';

  fecharModal('modalUsuario');
  renderUsuarios();
  atualizarTodosSelects();
}

function renderUsuarios() {
  const tbody = document.getElementById('usr-tabela');
  if (!tbody) return;

  if (DB.usuarios.length === 0) {
    tbody.innerHTML = '<tr><td colspan="4" class="text-center text-muted">Nenhum usuário cadastrado.</td></tr>';
    return;
  }

  tbody.innerHTML = DB.usuarios.map(u => `
    <tr>
      <td>${u.id}</td>
      <td>${u.nomeCompleto}</td>
      <td>${u.email}</td>
      <td>${u.dataCadastro}</td>
    </tr>`).join('');
}

// --- categorias ---

function salvarCategoria() {
  const nome = document.getElementById('cat-nome').value.trim();
  const desc = document.getElementById('cat-desc').value.trim();
  limparErro('cat-erro');

  if (!nome) return mostrarErro('cat-erro', 'Nome é obrigatório.');

  const duplicado = DB.categorias.find(c => c.nome.toLowerCase() === nome.toLowerCase());
  if (duplicado) return mostrarErro('cat-erro', 'Já existe uma categoria com este nome.');

  DB.categorias.push(new Categoria(nome, desc));

  document.getElementById('cat-nome').value = '';
  document.getElementById('cat-desc').value = '';

  fecharModal('modalCategoria');
  renderCategorias();
  atualizarTodosSelects();
}

function renderCategorias() {
  const tbody = document.getElementById('cat-tabela');
  if (!tbody) return;

  tbody.innerHTML = DB.categorias.length === 0
    ? '<tr><td colspan="3" class="text-center text-muted">Nenhuma categoria cadastrada.</td></tr>'
    : DB.categorias.map(c => `
      <tr>
        <td>${c.id}</td>
        <td>${c.nome}</td>
        <td>${c.descricao || '—'}</td>
      </tr>`).join('');
}

// --- cursos ---

function salvarCurso() {
  const titulo      = document.getElementById('cur-titulo').value.trim();
  const desc        = document.getElementById('cur-desc').value.trim();
  const idInstrutor = document.getElementById('cur-instrutor').value;
  const idCategoria = document.getElementById('cur-categoria').value;
  const nivel       = document.getElementById('cur-nivel').value;
  const totalAulas  = document.getElementById('cur-aulas').value;
  const totalHoras  = document.getElementById('cur-horas').value;
  limparErro('cur-erro');

  if (!titulo)      return mostrarErro('cur-erro', 'Título é obrigatório.');
  if (!idInstrutor) return mostrarErro('cur-erro', 'Selecione um instrutor.');
  if (!idCategoria) return mostrarErro('cur-erro', 'Selecione uma categoria.');
  if (!nivel)       return mostrarErro('cur-erro', 'Selecione o nível.');

  DB.cursos.push(new Curso(titulo, desc, idInstrutor, idCategoria, nivel, totalAulas, totalHoras));

  document.getElementById('cur-titulo').value = '';
  document.getElementById('cur-desc').value   = '';
  document.getElementById('cur-aulas').value  = '';
  document.getElementById('cur-horas').value  = '';

  fecharModal('modalCurso');
  renderCursos();
  atualizarTodosSelects();
}

function renderCursos() {
  const filtroId = parseInt(document.getElementById('filtro-categoria-cursos')?.value) || null;
  const lista = filtroId ? DB.cursos.filter(c => c.idCategoria === filtroId) : DB.cursos;
  const tbody = document.getElementById('cur-tabela');
  if (!tbody) return;

  const corNivel = { 'Iniciante': 'success', 'Intermediário': 'warning', 'Avançado': 'danger' };

  tbody.innerHTML = lista.length === 0
    ? '<tr><td colspan="6" class="text-center text-muted">Nenhum curso encontrado.</td></tr>'
    : lista.map(c => {
        const cat  = DB.categorias.find(x => x.id === c.idCategoria);
        const inst = DB.usuarios.find(x => x.id === c.idInstrutor);
        return `<tr>
          <td>${c.id}</td>
          <td>${c.titulo}</td>
          <td>${cat ? cat.nome : '—'}</td>
          <td>${inst ? inst.nomeCompleto : '—'}</td>
          <td><span class="badge bg-${corNivel[c.nivel] || 'secondary'}">${c.nivel}</span></td>
          <td>${c.dataPublicacao}</td>
        </tr>`;
      }).join('');
}

// --- modulos ---

function salvarModulo() {
  const idCurso = document.getElementById('mod-curso').value;
  const titulo  = document.getElementById('mod-titulo').value.trim();
  const ordem   = document.getElementById('mod-ordem').value;
  limparErro('mod-erro');

  if (!idCurso) return mostrarErro('mod-erro', 'Selecione um curso.');
  if (!titulo)  return mostrarErro('mod-erro', 'Título é obrigatório.');
  if (!ordem || ordem < 1) return mostrarErro('mod-erro', 'Ordem deve ser maior que zero.');

  DB.modulos.push(new Modulo(idCurso, titulo, ordem));

  document.getElementById('mod-titulo').value = '';
  document.getElementById('mod-ordem').value  = '';

  fecharModal('modalModulo');
  renderModulos();
  atualizarTodosSelects();
}

function renderModulos() {
  const tbody = document.getElementById('mod-tabela');
  if (!tbody) return;

  const lista = [...DB.modulos].sort((a, b) => a.ordem - b.ordem);

  tbody.innerHTML = lista.length === 0
    ? '<tr><td colspan="4" class="text-center text-muted">Nenhum módulo cadastrado.</td></tr>'
    : lista.map(m => {
        const cur = DB.cursos.find(x => x.id === m.idCurso);
        return `<tr>
          <td>${m.id}</td>
          <td>${cur ? cur.titulo : '—'}</td>
          <td>${m.titulo}</td>
          <td>${m.ordem}</td>
        </tr>`;
      }).join('');
}

// --- aulas ---

function salvarAula() {
  const idModulo = document.getElementById('aul-modulo').value;
  const titulo   = document.getElementById('aul-titulo').value.trim();
  const tipo     = document.getElementById('aul-tipo').value;
  const url      = document.getElementById('aul-url').value.trim();
  const duracao  = document.getElementById('aul-duracao').value;
  const ordem    = document.getElementById('aul-ordem').value;
  limparErro('aul-erro');

  if (!idModulo) return mostrarErro('aul-erro', 'Selecione um módulo.');
  if (!titulo)   return mostrarErro('aul-erro', 'Título é obrigatório.');
  if (!tipo)     return mostrarErro('aul-erro', 'Selecione o tipo de conteúdo.');
  if (!ordem || ordem < 1) return mostrarErro('aul-erro', 'Ordem deve ser maior que zero.');

  DB.aulas.push(new Aula(idModulo, titulo, tipo, url, duracao, ordem));

  document.getElementById('aul-titulo').value  = '';
  document.getElementById('aul-url').value     = '';
  document.getElementById('aul-duracao').value = '';
  document.getElementById('aul-ordem').value   = '';

  fecharModal('modalAula');
  renderAulas();
  atualizarTodosSelects();
}

function renderAulas() {
  const tbody = document.getElementById('aul-tabela');
  if (!tbody) return;

  const lista = [...DB.aulas].sort((a, b) => a.ordem - b.ordem);
  const corTipo = { 'Vídeo': 'primary', 'Texto': 'info', 'Quiz': 'warning' };

  tbody.innerHTML = lista.length === 0
    ? '<tr><td colspan="6" class="text-center text-muted">Nenhuma aula cadastrada.</td></tr>'
    : lista.map(a => {
        const mod = DB.modulos.find(x => x.id === a.idModulo);
        return `<tr>
          <td>${a.id}</td>
          <td>${mod ? mod.titulo : '—'}</td>
          <td>${a.titulo}</td>
          <td><span class="badge bg-${corTipo[a.tipoConteudo] || 'secondary'}">${a.tipoConteudo}</span></td>
          <td>${a.duracaoMinutos} min</td>
          <td>${a.ordem}</td>
        </tr>`;
      }).join('');
}

// --- matriculas ---

function trocarTipoMatricula(tipo) {
  document.getElementById('mat-grupo-curso').classList.toggle('d-none', tipo !== 'curso');
  document.getElementById('mat-grupo-plano').classList.toggle('d-none', tipo !== 'plano');
}

function salvarMatricula() {
  const idUsuario = document.getElementById('mat-usuario').value;
  const tipo = document.querySelector('input[name="tipoMatricula"]:checked')?.value;
  limparErro('mat-erro');

  if (!idUsuario) return mostrarErro('mat-erro', 'Selecione um usuário.');

  if (tipo === 'curso') {
    const idCurso = document.getElementById('mat-curso').value;
    if (!idCurso) return mostrarErro('mat-erro', 'Selecione um curso.');

    const jaMatriculado = DB.matriculas.find(
      m => m.idUsuario === Number(idUsuario) && m.idCurso === Number(idCurso)
    );
    if (jaMatriculado) return mostrarErro('mat-erro', 'Usuário já está matriculado neste curso.');

    DB.matriculas.push(new Matricula(idUsuario, idCurso));

  } else {
    const idPlano = document.getElementById('mat-plano').value;
    const metodo  = document.getElementById('mat-metodo').value;
    if (!idPlano) return mostrarErro('mat-erro', 'Selecione um plano.');
    if (!metodo)  return mostrarErro('mat-erro', 'Selecione o método de pagamento.');

    const plano = DB.planos.find(p => p.id === Number(idPlano));
    const ass   = new Assinatura(idUsuario, idPlano, plano.duracaoMeses);
    DB.assinaturas.push(ass);
    DB.pagamentos.push(new Pagamento(ass.id, plano.preco, metodo));
    renderPagamentos();
  }

  fecharModal('modalMatricula');
  renderMatriculas();
}

function renderMatriculas() {
  const tbody = document.getElementById('mat-tabela');
  if (!tbody) return;

  tbody.innerHTML = DB.matriculas.length === 0
    ? '<tr><td colspan="4" class="text-center text-muted">Nenhuma matrícula registrada.</td></tr>'
    : DB.matriculas.map(m => {
        const usr = DB.usuarios.find(x => x.id === m.idUsuario);
        const cur = DB.cursos.find(x => x.id === m.idCurso);
        return `<tr>
          <td>${m.id}</td>
          <td>${usr ? usr.nomeCompleto : '—'}</td>
          <td>${cur ? cur.titulo : '—'}</td>
          <td>${m.dataMatricula}</td>
        </tr>`;
      }).join('');
}

// --- progresso e certificados ---

function salvarProgresso() {
  const idUsuario = document.getElementById('prog-usuario').value;
  const idAula    = document.getElementById('prog-aula').value;
  limparErro('prog-erro');

  if (!idUsuario) return mostrarErro('prog-erro', 'Selecione um usuário.');
  if (!idAula)    return mostrarErro('prog-erro', 'Selecione uma aula.');

  const jaConc = DB.progressos.find(
    p => p.idUsuario === Number(idUsuario) && p.idAula === Number(idAula)
  );
  if (jaConc) return mostrarErro('prog-erro', 'Esta aula já foi marcada como concluída.');

  DB.progressos.push(new ProgressoAula(idUsuario, idAula));
  fecharModal('modalProgresso');
  renderProgressos();

  // verifica se o curso todo foi concluído
  const aula   = DB.aulas.find(a => a.id === Number(idAula));
  const modulo = aula ? DB.modulos.find(m => m.id === aula.idModulo) : null;
  if (modulo) verificarConclusao(Number(idUsuario), modulo.idCurso);
}

function verificarConclusao(idUsuario, idCurso) {
  const modulosDoCurso = DB.modulos.filter(m => m.idCurso === idCurso);
  const aulasDoCurso   = DB.aulas.filter(a => modulosDoCurso.some(m => m.id === a.idModulo));

  if (aulasDoCurso.length === 0) return;

  const concluidas = DB.progressos.filter(
    p => p.idUsuario === idUsuario && aulasDoCurso.some(a => a.id === p.idAula)
  );

  if (concluidas.length === aulasDoCurso.length) {
    const jaTemCert = DB.certificados.find(c => c.idUsuario === idUsuario && c.idCurso === idCurso);
    if (!jaTemCert) {
      DB.certificados.push(new Certificado(idUsuario, idCurso));
      renderCertificados();
      setTimeout(() => alert('Parabéns! Certificado gerado automaticamente!'), 200);
    }

    const mat = DB.matriculas.find(m => m.idUsuario === idUsuario && m.idCurso === idCurso);
    if (mat && !mat.dataConclusao) {
      mat.dataConclusao = new Date().toLocaleDateString('pt-BR');
      renderMatriculas();
    }
  }
}

function renderProgressos() {
  const tbody = document.getElementById('prog-tabela');
  if (!tbody) return;

  tbody.innerHTML = DB.progressos.length === 0
    ? '<tr><td colspan="4" class="text-center text-muted">Nenhum progresso registrado.</td></tr>'
    : DB.progressos.map(p => {
        const usr = DB.usuarios.find(x => x.id === p.idUsuario);
        const aul = DB.aulas.find(x => x.id === p.idAula);
        return `<tr>
          <td>${usr ? usr.nomeCompleto : '—'}</td>
          <td>${aul ? aul.titulo : '—'}</td>
          <td><span class="badge bg-success">${p.status}</span></td>
          <td>${p.dataConclusao}</td>
        </tr>`;
      }).join('');
}

function renderCertificados() {
  const tbody = document.getElementById('cert-tabela');
  if (!tbody) return;

  tbody.innerHTML = DB.certificados.length === 0
    ? '<tr><td colspan="5" class="text-center text-muted">Nenhum certificado emitido.</td></tr>'
    : DB.certificados.map(c => {
        const usr = DB.usuarios.find(x => x.id === c.idUsuario);
        const cur = DB.cursos.find(x => x.id === c.idCurso);
        return `<tr>
          <td>${c.id}</td>
          <td>${usr ? usr.nomeCompleto : '—'}</td>
          <td>${cur ? cur.titulo : '—'}</td>
          <td><span class="badge bg-warning text-dark font-monospace">${c.codigoVerificacao}</span></td>
          <td>${c.dataEmissao}</td>
        </tr>`;
      }).join('');
}

// --- avaliacoes ---

function salvarAvaliacao() {
  const idUsuario  = document.getElementById('avl-usuario').value;
  const idCurso    = document.getElementById('avl-curso').value;
  const nota       = document.getElementById('avl-nota').value;
  const comentario = document.getElementById('avl-comentario').value.trim();
  limparErro('avl-erro');

  if (!idUsuario) return mostrarErro('avl-erro', 'Selecione um usuário.');
  if (!idCurso)   return mostrarErro('avl-erro', 'Selecione um curso.');
  if (!nota || nota < 1 || nota > 5) return mostrarErro('avl-erro', 'Nota deve ser entre 1 e 5.');

  const jaAvaliou = DB.avaliacoes.find(
    a => a.idUsuario === Number(idUsuario) && a.idCurso === Number(idCurso)
  );
  if (jaAvaliou) return mostrarErro('avl-erro', 'Usuário já avaliou este curso.');

  DB.avaliacoes.push(new Avaliacao(idUsuario, idCurso, nota, comentario));

  document.getElementById('avl-nota').value       = '';
  document.getElementById('avl-comentario').value = '';

  fecharModal('modalAvaliacao');
  renderAvaliacoes();
}

function renderAvaliacoes() {
  const tbody = document.getElementById('avl-tabela');
  if (!tbody) return;

  tbody.innerHTML = DB.avaliacoes.length === 0
    ? '<tr><td colspan="5" class="text-center text-muted">Nenhuma avaliação registrada.</td></tr>'
    : DB.avaliacoes.map(a => {
        const usr = DB.usuarios.find(x => x.id === a.idUsuario);
        const cur = DB.cursos.find(x => x.id === a.idCurso);
        return `<tr>
          <td>${usr ? usr.nomeCompleto : '—'}</td>
          <td>${cur ? cur.titulo : '—'}</td>
          <td class="text-warning">${estrelas(a.nota)} (${a.nota}/5)</td>
          <td>${a.comentario || '—'}</td>
          <td>${a.dataAvaliacao}</td>
        </tr>`;
      }).join('');
}

// --- trilhas ---

function salvarTrilha() {
  const titulo      = document.getElementById('tri-titulo').value.trim();
  const desc        = document.getElementById('tri-desc').value.trim();
  const idCategoria = document.getElementById('tri-categoria').value;
  limparErro('tri-erro');

  if (!titulo)      return mostrarErro('tri-erro', 'Título é obrigatório.');
  if (!idCategoria) return mostrarErro('tri-erro', 'Selecione uma categoria.');

  DB.trilhas.push(new Trilha(titulo, desc, idCategoria));

  document.getElementById('tri-titulo').value = '';
  document.getElementById('tri-desc').value   = '';

  fecharModal('modalTrilha');
  renderTrilhas();
  atualizarTodosSelects();
}

function salvarTrilhaCurso() {
  const idTrilha = document.getElementById('tc-trilha').value;
  const idCurso  = document.getElementById('tc-curso').value;
  const ordem    = document.getElementById('tc-ordem').value;
  limparErro('tc-erro');

  if (!idTrilha) return mostrarErro('tc-erro', 'Selecione uma trilha.');
  if (!idCurso)  return mostrarErro('tc-erro', 'Selecione um curso.');
  if (!ordem || ordem < 1) return mostrarErro('tc-erro', 'Ordem deve ser maior que zero.');

  const jaExiste = DB.trilhasCursos.find(
    tc => tc.idTrilha === Number(idTrilha) && tc.idCurso === Number(idCurso)
  );
  if (jaExiste) return mostrarErro('tc-erro', 'Este curso já foi adicionado a esta trilha.');

  DB.trilhasCursos.push(new TrilhaCurso(idTrilha, idCurso, ordem));
  document.getElementById('tc-ordem').value = '';

  fecharModal('modalTrilhaCurso');
  renderTrilhasCursos();
}

function renderTrilhas() {
  const tbody = document.getElementById('tri-tabela');
  if (!tbody) return;

  tbody.innerHTML = DB.trilhas.length === 0
    ? '<tr><td colspan="3" class="text-center text-muted">Nenhuma trilha cadastrada.</td></tr>'
    : DB.trilhas.map(t => {
        const cat = DB.categorias.find(x => x.id === t.idCategoria);
        return `<tr>
          <td>${t.id}</td>
          <td>${t.titulo}</td>
          <td>${cat ? cat.nome : '—'}</td>
        </tr>`;
      }).join('');
}

function renderTrilhasCursos() {
  const tbody = document.getElementById('tc-tabela');
  if (!tbody) return;

  const lista = [...DB.trilhasCursos].sort((a, b) => a.ordem - b.ordem);

  tbody.innerHTML = lista.length === 0
    ? '<tr><td colspan="4" class="text-center text-muted">Nenhum curso vinculado às trilhas.</td></tr>'
    : lista.map(tc => {
        const tri = DB.trilhas.find(x => x.id === tc.idTrilha);
        const cur = DB.cursos.find(x => x.id === tc.idCurso);
        return `<tr>
          <td>${tri ? tri.titulo : '—'}</td>
          <td>${cur ? cur.titulo : '—'}</td>
          <td>${tc.ordem}</td>
        </tr>`;
      }).join('');
}

// --- planos ---

function salvarPlano() {
  const nome    = document.getElementById('pla-nome').value.trim();
  const desc    = document.getElementById('pla-desc').value.trim();
  const preco   = document.getElementById('pla-preco').value;
  const duracao = document.getElementById('pla-duracao').value;
  limparErro('pla-erro');

  if (!nome)   return mostrarErro('pla-erro', 'Nome é obrigatório.');
  if (!preco || preco <= 0) return mostrarErro('pla-erro', 'Preço deve ser maior que zero.');
  if (!duracao || duracao < 1) return mostrarErro('pla-erro', 'Duração deve ser maior que zero.');

  DB.planos.push(new Plano(nome, desc, preco, duracao));

  document.getElementById('pla-nome').value    = '';
  document.getElementById('pla-desc').value    = '';
  document.getElementById('pla-preco').value   = '';
  document.getElementById('pla-duracao').value = '';

  fecharModal('modalPlano');
  renderPlanos();
  atualizarTodosSelects();
}

function renderPlanos() {
  const tbody = document.getElementById('pla-tabela');
  if (!tbody) return;

  tbody.innerHTML = DB.planos.length === 0
    ? '<tr><td colspan="4" class="text-center text-muted">Nenhum plano cadastrado.</td></tr>'
    : DB.planos.map(p => `
      <tr>
        <td>${p.id}</td>
        <td>${p.nome}</td>
        <td>R$ ${p.preco.toFixed(2)}</td>
        <td>${p.duracaoMeses} meses</td>
      </tr>`).join('');
}

// --- pagamentos e checkout ---

function realizarCheckout() {
  const idUsuario = document.getElementById('pay-usuario').value;
  const idPlano   = document.getElementById('pay-plano').value;
  const metodo    = document.getElementById('pay-metodo').value;
  limparErro('pay-erro');

  if (!idUsuario) return mostrarErro('pay-erro', 'Selecione um usuário.');
  if (!idPlano)   return mostrarErro('pay-erro', 'Selecione um plano.');
  if (!metodo)    return mostrarErro('pay-erro', 'Selecione o método de pagamento.');

  const plano      = DB.planos.find(p => p.id === Number(idPlano));
  const assinatura = new Assinatura(idUsuario, idPlano, plano.duracaoMeses);
  DB.assinaturas.push(assinatura);

  const pagamento = new Pagamento(assinatura.id, plano.preco, metodo);
  DB.pagamentos.push(pagamento);

  fecharModal('modalCheckout');
  renderPagamentos();
  renderAssinaturas();

  setTimeout(() => {
    alert(`Pagamento realizado!\n\nID da Transação: ${pagamento.idTransacaoGateway}\nMétodo: ${metodo}\nValor: R$ ${plano.preco.toFixed(2)}`);
  }, 200);
}

function renderPagamentos() {
  const tbody = document.getElementById('pay-tabela');
  if (!tbody) return;

  tbody.innerHTML = DB.pagamentos.length === 0
    ? '<tr><td colspan="5" class="text-center text-muted">Nenhum pagamento registrado.</td></tr>'
    : DB.pagamentos.map(p => {
        const ass = DB.assinaturas.find(a => a.id === p.idAssinatura);
        const usr = ass ? DB.usuarios.find(u => u.id === ass.idUsuario) : null;
        const pla = ass ? DB.planos.find(x => x.id === ass.idPlano) : null;
        return `<tr>
          <td>${p.id}</td>
          <td>${usr ? usr.nomeCompleto : '—'}</td>
          <td>${pla ? pla.nome : '—'}</td>
          <td>R$ ${p.valorPago.toFixed(2)}</td>
          <td><span class="badge bg-info text-dark">${p.metodoPagamento}</span></td>
          <td><code>${p.idTransacaoGateway}</code></td>
          <td>${p.dataPagamento}</td>
        </tr>`;
      }).join('');
}

function renderAssinaturas() {
  const tbody = document.getElementById('ass-tabela');
  if (!tbody) return;

  tbody.innerHTML = DB.assinaturas.length === 0
    ? '<tr><td colspan="4" class="text-center text-muted">Nenhuma assinatura ativa.</td></tr>'
    : DB.assinaturas.map(a => {
        const usr = DB.usuarios.find(x => x.id === a.idUsuario);
        const pla = DB.planos.find(x => x.id === a.idPlano);
        return `<tr>
          <td>${a.id}</td>
          <td>${usr ? usr.nomeCompleto : '—'}</td>
          <td>${pla ? pla.nome : '—'}</td>
          <td>${a.dataInicio}</td>
          <td>${a.dataFim}</td>
        </tr>`;
      }).join('');
}

// atualiza todos os selects dinamicos
function atualizarTodosSelects() {
  ['mat-usuario', 'prog-usuario', 'avl-usuario', 'pay-usuario'].forEach(id =>
    popularSelect(id, DB.usuarios, u => u.nomeCompleto, u => u.id));

  ['cur-categoria', 'tri-categoria', 'filtro-categoria-cursos'].forEach(id =>
    popularSelect(id, DB.categorias, c => c.nome, c => c.id,
      id === 'filtro-categoria-cursos' ? 'Todas as categorias' : 'Selecione...'));

  ['mat-curso', 'avl-curso', 'tc-curso'].forEach(id =>
    popularSelect(id, DB.cursos, c => c.titulo, c => c.id));

  popularSelect('cur-instrutor', DB.usuarios, u => u.nomeCompleto, u => u.id);

  popularSelect('aul-modulo', DB.modulos, m => {
    const cur = DB.cursos.find(x => x.id === m.idCurso);
    return `${cur ? cur.titulo : '?'} — ${m.titulo} (ord. ${m.ordem})`;
  }, m => m.id);

  popularSelect('prog-aula', DB.aulas, a => {
    const mod = DB.modulos.find(x => x.id === a.idModulo);
    return `${mod ? mod.titulo : '?'} — ${a.titulo}`;
  }, a => a.id);

  ['mat-plano', 'pay-plano'].forEach(id =>
    popularSelect(id, DB.planos,
      p => `${p.nome} — R$ ${p.preco.toFixed(2)} (${p.duracaoMeses} meses)`,
      p => p.id));

  popularSelect('tc-trilha', DB.trilhas, t => t.titulo, t => t.id);
}

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('input[name="tipoMatricula"]').forEach(radio => {
    radio.addEventListener('change', e => trocarTipoMatricula(e.target.value));
  });

  const filtro = document.getElementById('filtro-categoria-cursos');
  if (filtro) filtro.addEventListener('change', renderCursos);

  renderUsuarios();
  renderCategorias();
  renderCursos();
  renderModulos();
  renderAulas();
  renderMatriculas();
  renderProgressos();
  renderCertificados();
  renderAvaliacoes();
  renderTrilhas();
  renderTrilhasCursos();
  renderPlanos();
  renderPagamentos();
  renderAssinaturas();
});