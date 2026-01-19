# 🎯 Habit Tracker Gamificado

Transformar a rotina em algo prazeroso nem sempre é fácil, e foi por isso que este **Diário de Hábitos Gamificado** foi criado. Mais do que uma simples lista de tarefas, este aplicativo para dispositivos móveis utiliza elementos de gamificação para transformar a disciplina diária em uma jornada de progresso visível, ajudando você a manter a motivação enquanto constrói uma versão melhor de si mesmo.

Desenvolvido com **React Native** e **Expo**, o app oferece uma interface limpa e intuitiva para que o foco permaneça no que realmente importa: a sua evolução pessoal.

---

## ✨ A Experiência de Uso

O aplicativo foi desenhado para ser um companheiro fiel no seu dia a dia. Ao abrir o app, você tem uma visão clara das suas metas e do seu estado atual de progresso, tornando a organização pessoal algo leve e recompensador.

### Evolução e Conquistas
A cada hábito concluído, você não apenas risca uma tarefa da lista, mas ganha experiência (XP). Esse sistema de pontuação alimenta o seu nível global, permitindo que você suba de categoria — começando como um iniciante com o ícone de uma semente (`🌱`) e evoluindo até se tornar um mestre com o ícone de coroa (`👑`). É uma representação visual direta do esforço que você dedica à sua rotina.

### Consistência Premiada (Streaks)
Sabemos que a repetição é a chave para a formação de novos hábitos. Por isso, o app monitora suas sequências (streaks). Manter um hábito por vários dias seguidos gera bônus de XP a cada 5 dias, incentivando você a não quebrar a corrente. Para ajudar na organização, cada hábito possui um painel mensal expansível com um mini calendário, facilitando a visualização de quais dias foram mais produtivos.

### Cuidado com a Rotina
Para garantir que você nunca se esqueça das suas metas, o sistema conta com notificações inteligentes de lembrete. Você pode personalizar o horário em que deseja ser avisado, garantindo que o aplicativo se adapte ao seu estilo de vida e ao momento em que você é mais produtivo.

---

## 🛠️ Tecnologias

Para garantir uma performance fluida e uma base de código sólida, foram utilizadas as seguintes ferramentas:

* **React Native & Expo:** A base para uma experiência mobile nativa e ágil tanto em Android quanto iOS.
* **React Navigation:** Responsável pela transição suave entre as telas de hábitos, progresso e configurações.
* **AsyncStorage:** Todos os seus dados, níveis e histórico de hábitos são armazenados localmente no seu dispositivo. Isso garante que sua privacidade seja preservada e que você tenha acesso às suas informações mesmo sem conexão com a internet.
* **Expo Notifications:** Sistema integrado para gerenciar os alertas diários e manter o engajamento com as metas.

---

## 🏗️ Organização do Projeto

O código foi estruturado de forma modular e organizada para facilitar futuras expansões e manutenção:
- **Components:** Onde residem os elementos visuais como as barras de progresso e os cartões de hábitos.
- **Services:** Camada que lida com a persistência de dados local e a configuração dos serviços do dispositivo.
- **Utils:** Contém toda a inteligência do app, como o cálculo de níveis, formatação de datas e as regras de ganho de XP.

---

## 🚀 Como instalar e rodar o projeto

Siga estes passos para configurar e executar o aplicativo em seu ambiente de desenvolvimento.

### Pré-requisitos
Certifique-se de ter o **Node.js** e o gerenciador de pacotes (**npm** ou **yarn**) instalados em sua máquina. Além disso, você precisará do aplicativo **Expo Go** instalado em seu celular para visualizar o projeto.

1.  **Clonar o Repositório:**
    ```bash
    git clone [https://github.com/Weslley-322/Habit-tracker.git](https://github.com/Weslley-322/Habit-tracker.git)
    ```
2.  **Instalar as Dependências:**
    ```bash
    cd Habit-tracker
    npm install
    ```
3.  **Iniciar o Projeto:**
    ```bash
    npx expo start
    ```
4.  **Executar no Celular:** Escaneie o QR Code exibido no terminal utilizando a câmera do seu celular (iOS) ou o aplicativo do Expo (Android).
