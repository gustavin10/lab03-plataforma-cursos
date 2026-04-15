import { Usuario } from '../model/Usuario.mjs';

const KEY = 'usuarios';

export class UsuarioService {
  #listarRaw() {
    return JSON.parse(localStorage.getItem(KEY) ?? '[]');
  }

  listar() {
    return this.#listarRaw();
  }

  buscarPorId(id) {
    return this.#listarRaw().find(u => u.id === id) ?? null;
  }

  buscarPorEmail(email) {
    return this.#listarRaw().find(
      u => u.email.toLowerCase() === email.toLowerCase()
    ) ?? null;
  }

  salvar(dados) {
    const erros = Usuario.validar(dados);
    if (erros.length) throw new Error(erros.join(' | '));
    if (this.buscarPorEmail(dados.email))
      throw new Error('Já existe um usuário com este e-mail.');
    const usuario = new Usuario(dados.nomeCompleto, dados.email, dados.senha);
    const lista = this.#listarRaw();
    lista.push(usuario);
    localStorage.setItem(KEY, JSON.stringify(lista));
    return usuario;
  }
}
