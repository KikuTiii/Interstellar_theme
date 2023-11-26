-- Arquivo de apoio, caso você queira criar tabelas como as aqui criadas para a API funcionar.
-- Você precisa executar os comandos no banco de dados para criar as tabelas,
-- ter este arquivo aqui não significa que a tabela em seu BD estará como abaixo!

/*
comandos para mysql - banco local - ambiente de desenvolvimento
*/
CREATE DATABASE projeto_individual;

USE projeto_individual;

CREATE TABLE usuario(
	id int primary key auto_increment,
    nome varchar(45),
    sobrenome varchar(45),
    email varchar(45),
    senha varchar(45)
);

-- select * from usuario;

CREATE TABLE stats(
	id int primary key auto_increment,
    acertos int,
    erros int,
    fkUsuario int,
    
    foreign key (fkUsuario) references usuario(id)
);

CREATE TABLE feedback(
	id int primary key auto_increment,
    fkUsuario int,
    textoFeedback varchar(45),
    
    foreign key (fkUsuario) references usuario(id)
    )
    
