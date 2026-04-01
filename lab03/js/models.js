let contadorId = 1;
function gerarId() {
  return contadorId++;
}

class Usuario {
  constructor(nomeCompleto, email, senha) {
    this.id = gerarId();
    this.nomeCompleto = nomeCompleto;
    this.email = email;
    this.senhaHash = btoa(senha);
    this.dataCadastro = new Date().toLocaleDateString('pt-BR');
  }
}

class Categoria {
  constructor(nome, descricao) {
    this.id = gerarId();
    this.nome = nome;
    this.descricao = descricao || '';
  }
}

class Curso {
  constructor(titulo, descricao, idInstrutor, idCategoria, nivel, totalAulas, totalHoras) {
    this.id = gerarId();
    this.titulo = titulo;
    this.descricao = descricao || '';
    this.idInstrutor = Number(idInstrutor);
    this.idCategoria = Number(idCategoria);
    this.nivel = nivel;
    this.dataPublicacao = new Date().toLocaleDateString('pt-BR');
    this.totalAulas = Number(totalAulas) || 0;
    this.totalHoras = Number(totalHoras) || 0;
  }
}

class Modulo {
  constructor(idCurso, titulo, ordem) {
    this.id = gerarId();
    this.idCurso = Number(idCurso);
    this.titulo = titulo;
    this.ordem = Number(ordem) || 1;
  }
}

class Aula {
  constructor(idModulo, titulo, tipoConteudo, urlConteudo, duracaoMinutos, ordem) {
    this.id = gerarId();
    this.idModulo = Number(idModulo);
    this.titulo = titulo;
    this.tipoConteudo = tipoConteudo;
    this.urlConteudo = urlConteudo || '';
    this.duracaoMinutos = Number(duracaoMinutos) || 0;
    this.ordem = Number(ordem) || 1;
  }
}

class Matricula {
  constructor(idUsuario, idCurso) {
    this.id = gerarId();
    this.idUsuario = Number(idUsuario);
    this.idCurso = Number(idCurso);
    this.dataMatricula = new Date().toLocaleDateString('pt-BR');
    this.dataConclusao = null;
  }
}

class ProgressoAula {
  constructor(idUsuario, idAula) {
    this.idUsuario = Number(idUsuario);
    this.idAula = Number(idAula);
    this.dataConclusao = new Date().toLocaleDateString('pt-BR');
    this.status = 'Concluído';
  }
}

class Avaliacao {
  constructor(idUsuario, idCurso, nota, comentario) {
    this.id = gerarId();
    this.idUsuario = Number(idUsuario);
    this.idCurso = Number(idCurso);
    this.nota = Number(nota);
    this.comentario = comentario || '';
    this.dataAvaliacao = new Date().toLocaleDateString('pt-BR');
  }
}

class Trilha {
  constructor(titulo, descricao, idCategoria) {
    this.id = gerarId();
    this.titulo = titulo;
    this.descricao = descricao || '';
    this.idCategoria = Number(idCategoria);
  }
}

class TrilhaCurso {
  constructor(idTrilha, idCurso, ordem) {
    this.idTrilha = Number(idTrilha);
    this.idCurso = Number(idCurso);
    this.ordem = Number(ordem) || 1;
  }
}

class Certificado {
  constructor(idUsuario, idCurso, idTrilha = null) {
    this.id = gerarId();
    this.idUsuario = Number(idUsuario);
    this.idCurso = Number(idCurso);
    this.idTrilha = idTrilha ? Number(idTrilha) : null;
    this.codigoVerificacao = 'CERT-' + Math.random().toString(36).substring(2, 10).toUpperCase();
    this.dataEmissao = new Date().toLocaleDateString('pt-BR');
  }
}

class Plano {
  constructor(nome, descricao, preco, duracaoMeses) {
    this.id = gerarId();
    this.nome = nome;
    this.descricao = descricao || '';
    this.preco = parseFloat(preco);
    this.duracaoMeses = Number(duracaoMeses);
  }
}

class Assinatura {
  constructor(idUsuario, idPlano, duracaoMeses) {
    this.id = gerarId();
    this.idUsuario = Number(idUsuario);
    this.idPlano = Number(idPlano);
    this.dataInicio = new Date().toLocaleDateString('pt-BR');
    const dataFim = new Date();
    dataFim.setMonth(dataFim.getMonth() + Number(duracaoMeses));
    this.dataFim = dataFim.toLocaleDateString('pt-BR');
  }
}

class Pagamento {
  constructor(idAssinatura, valorPago, metodoPagamento) {
    this.id = gerarId();
    this.idAssinatura = Number(idAssinatura);
    this.valorPago = parseFloat(valorPago);
    this.dataPagamento = new Date().toLocaleDateString('pt-BR');
    this.metodoPagamento = metodoPagamento;
    this.idTransacaoGateway = 'TXN-' + Math.random().toString(36).substring(2, 10).toUpperCase();
  }
}

const DB = {
  usuarios: [],
  categorias: [],
  cursos: [],
  modulos: [],
  aulas: [],
  matriculas: [],
  progressos: [],
  avaliacoes: [],
  trilhas: [],
  trilhasCursos: [],
  certificados: [],
  planos: [],
  assinaturas: [],
  pagamentos: [],
};