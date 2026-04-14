import { getUsuarioService,   salvarUsuario,    renderUsuarios    } from './controller/UsuarioController.mjs';
import { getCategoriaService, salvarCategoria,  renderCategorias  } from './controller/CategoriaController.mjs';
import { getCursoService,     salvarCurso,      renderCursos      } from './controller/CursoController.mjs';
import { getModuloService,    salvarModulo,      renderModulos     } from './controller/ModuloController.mjs';
import { getAulaService,      salvarAula,        renderAulas       } from './controller/AulaController.mjs';
import { getMatriculaService, salvarMatricula,   renderMatriculas,
         trocarTipoMatricula                                        } from './controller/MatriculaController.mjs';
import { getProgressoService, salvarProgresso,   renderProgressos,
         renderCertificados                                         } from './controller/ProgressoController.mjs';
import {                       salvarAvaliacao,  renderAvaliacoes  } from './controller/AvaliacaoController.mjs';
import { getTrilhaService,    salvarTrilha,      renderTrilhas,
         salvarTrilhaCurso,   renderTrilhasCursos                  } from './controller/TrilhaController.mjs';
import { getFinanceiroService, salvarPlano,      realizarCheckout,
         renderPlanos,         renderAssinaturas, renderPagamentos  } from './controller/FinanceiroController.mjs';
import { popularSelect } from './controller/ui.mjs';

window._services = {
  usuario:    getUsuarioService(),
  categoria:  getCategoriaService(),
  curso:      getCursoService(),
  modulo:     getModuloService(),
  aula:       getAulaService(),
  matricula:  getMatriculaService(),
  progresso:  getProgressoService(),
  trilha:     getTrilhaService(),
  financeiro: getFinanceiroService(),
};

window._renders = {
  matriculas:   renderMatriculas,
  pagamentos:   renderPagamentos,
  assinaturas:  renderAssinaturas,
};

Object.assign(window, {
  salvarUsuario,
  salvarCategoria,
  salvarCurso,
  salvarModulo,
  salvarAula,
  salvarMatricula,
  trocarTipoMatricula,
  salvarProgresso,
  salvarAvaliacao,
  salvarTrilha,
  salvarTrilhaCurso,
  salvarPlano,
  realizarCheckout,
});

function atualizarTodosSelects() {
  const s = window._services;

  ['mat-usuario', 'prog-usuario', 'avl-usuario', 'pay-usuario'].forEach(id =>
    popularSelect(id, s.usuario.listar(), u => u.nomeCompleto, u => u.id));

  ['cur-categoria', 'tri-categoria', 'filtro-categoria-cursos'].forEach(id =>
    popularSelect(
      id,
      s.categoria.listar(),
      c => c.nome,
      c => c.id,
      id === 'filtro-categoria-cursos' ? 'Todas as categorias' : 'Selecione...'
    ));

  ['mat-curso', 'avl-curso', 'tc-curso'].forEach(id =>
    popularSelect(id, s.curso.listar(), c => c.titulo, c => c.id));

  popularSelect('cur-instrutor', s.usuario.listar(), u => u.nomeCompleto, u => u.id);

  popularSelect('mod-curso', s.curso.listar(), c => c.titulo, c => c.id);

  popularSelect('aul-modulo', s.modulo.listar(), m => {
    const cur = s.curso.listar().find(x => x.id === m.idCurso);
    return `${cur ? cur.titulo : '?'} — ${m.titulo} (ord. ${m.ordem})`;
  }, m => m.id);

  popularSelect('prog-aula', s.aula.listar(), a => {
    const mod = s.modulo.listar().find(x => x.id === a.idModulo);
    return `${mod ? mod.titulo : '?'} — ${a.titulo}`;
  }, a => a.id);

  ['mat-plano', 'pay-plano'].forEach(id =>
    popularSelect(
      id,
      s.financeiro.listarPlanos(),
      p => `${p.nome} — R$ ${p.preco.toFixed(2)} (${p.duracaoMeses} meses)`,
      p => p.id
    ));

  popularSelect('tc-trilha', s.trilha.listarTrilhas(), t => t.titulo, t => t.id);
}

window._atualizarTodosSelects = atualizarTodosSelects;

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('input[name="tipoMatricula"]').forEach(radio =>
    radio.addEventListener('change', e => trocarTipoMatricula(e.target.value))
  );

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
