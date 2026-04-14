import { Usuario } from '../model/Usuario.mjs';

const _usuarios = [];

export class UsuarioService {
  listar() {
    return [..._usuarios];
  }

  buscarPorId(id) {
    return _usuarios.find(u => u.id === id) ?? null;
  }

  buscarPorEmail(email) {
    return _usuarios.find(u => u.email.toLowerCase() === email.toLowerCase()) ?? null;
  }

  salvar(dados) {
    const erros = Usuario.validar(dados);
    if (erros.length) throw new Error(erros.join(' | '));
    if (this.buscarPorEmail(dados.email))
      throw new Error('Já existe um usuário com este e-mail.');
    const usuario = new Usuario(dados.nomeCompleto, dados.email, dados.senha);
    _usuarios.push(usuario);
    return usuario;
  }
}
