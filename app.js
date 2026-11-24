// Estado Global da Aplicação
const state = {
  currentTab: 'celular',
  selectedSubmatterId: null,
  cellType: 'animal',
  selectedOrganelle: null,
  scaleZoom: 45,
  selectedHeartPart: 've',
  selectedCladeNode: 'amniota',
  // Estado dos Flashcards
  flashcardFilter: 'todas',
  flashcardIndex: 0,
  flashcardFlipped: false,
  masteredCards: JSON.parse(localStorage.getItem('bioos_mastered_cards') || '[]'),
  celularData: null,
  disciplinasData: null,
  unlockedBadges: JSON.parse(localStorage.getItem('bioos_badges') || '[]'),
  correctAnswersCount: Number(localStorage.getItem('bioos_correct_count') || '0')
};

const MENU_ITEMS = [
  { id: 'celular', label: 'Biologia Celular', icon: '🔬', badge: 'Citologista' },
  { id: 'anatomia', label: 'Anatomia', icon: '🦴', badge: 'Anatomista' },
  { id: 'evolucao', label: 'Evolução', icon: '🦍', badge: 'Evolucionista' },
  { id: 'nervoso', label: 'Sist. Nervoso', icon: '🧠', badge: 'Neurocientista' },
  { id: 'digestorio', label: 'Sist. Digestório', icon: '🍎', badge: 'Fisiologista' },
  { id: 'zoologia', label: 'Zoologia', icon: '🦎', badge: 'Zoólogo' },
  { id: 'botanica', label: 'Botânica', icon: '🌿', badge: 'Botânico' },
  { id: 'bioquimica', label: 'Bioquímica/Física', icon: '⚗️', badge: 'Bioquímico' },
  { id: 'flashcards', label: 'Flashcards', icon: '🃏', badge: null },
  { id: 'noticias', label: 'Revistas & Nobel', icon: '📰', badge: null }
];

const FLASHCARDS_DECK = [
  { id: 'fc_1', area: 'celular', tag: 'Biologia Celular', frente: 'Por que mitocôndrias e cloroplastos possuem DNA circular próprio e ribossomos semelhantes aos de bactérias?', verso: 'Pela Teoria Endossimbiótica: ancestrais procariontes aeróbicos e fotossintéticos foram englobados por células hospedeiras e passaram a viver em simbiose metabólica.' },
  { id: 'fc_2', area: 'celular', tag: 'Biologia Celular', frente: 'Qual a diferença principal entre Retículo Endoplasmático Rugoso (RER) e Liso (REL)?', verso: 'O RER tem ribossomos aderidos e atua na síntese/dobramento de proteínas de secreção ou membrana; o REL não tem ribossomos e sintetiza lipídios/esteroides, armazena Ca²⁺ e detoxifica substâncias.' },
  { id: 'fc_3', area: 'anatomia', tag: 'Anatomia Humana', frente: 'Por que as veias pulmonares carregam sangue oxigenado e a artéria pulmonar carrega sangue venoso?', verso: 'A definição anatômica de artéria é o vaso que sai do coração e de veia é o que chega ao coração — não o teor de O₂ ou CO₂.' },
  { id: 'fc_4', area: 'anatomia', tag: 'Anatomia Humana', frente: 'Qual íon desencadeia a interação entre actina e miosina na contração muscular esquelética?', verso: 'O íon Cálcio (Ca²⁺), liberado pelo retículo sarcoplasmático, liga-se à troponina e desloca a tropomiosina dos sítios ativos da actina.' },
  { id: 'fc_5', area: 'evolucao', tag: 'Evolução Biológica', frente: 'O que é uma sinapomorfia e qual seu papel na cladística?', verso: 'É uma característica derivada (novidade evolutiva) compartilhada por um ancestral comum e seus descendentes, usada para delimitar grupos monofiléticos (clados).' },
  { id: 'fc_6', area: 'evolucao', tag: 'Evolução Biológica', frente: 'Qual a diferença entre deriva genética e seleção natural?', verso: 'A seleção natural favorece alelos ligados a maior sucesso reprodutivo (processo adaptativo); a deriva genética altera frequências alélicas ao acaso, com maior efeito em populações pequenas.' },
  { id: 'fc_7', area: 'nervoso', tag: 'Sistema Nervoso', frente: 'O que é condução saltatória e qual estrutura a torna possível?', verso: 'É a propagação do potencial de ação "saltando" de um Nódulo de Ranvier a outro ao longo de axônios mielinizados, aumentando a velocidade do impulso.' },
  { id: 'fc_8', area: 'digestorio', tag: 'Sistema Digestório', frente: 'A bile contém enzimas digestivas? Qual é seu papel na digestão de gorduras?', verso: 'Não contém enzimas digestivas. Seus sais biliares emulsificam grandes gotas lipídicas em microgotículas, aumentando a área de superfície para a lipase pancreática.' },
  { id: 'fc_9', area: 'zoologia', tag: 'Zoologia Comparada', frente: 'Quais são as quatro características fundamentais presentes em algum momento do ciclo de vida dos cordados?', verso: 'Notocorda, tubo nervoso dorsal único, fendas (ou bolsas) faríngeas e cauda muscular pós-anal.' },
  { id: 'fc_10', area: 'botanica', tag: 'Botânica', frente: 'Como a seiva bruta (água e sais minerais) sobe até o topo de árvores altas?', verso: 'Pelo xilema, segundo o modelo de coesão-tensão: a transpiração nas folhas cria tensão negativa que puxa a coluna contínua de água mantida por coesão entre moléculas de água e adesão às paredes dos vasos.' },
  { id: 'fc_11', area: 'bioquimica', tag: 'Bioquímica & Biofísica', frente: 'Uma enzima altera a variação de energia livre (ΔG) de uma reação química?', verso: 'Não. Enzimas reduzem a energia de ativação necessária para atingir o estado de transição, acelerando a velocidade sem alterar o equilíbrio termodinâmico.' }
];

const CELL_JOURNAL_ARTICLES = [
  {
    id: 'endossimbiose',
    edicao: 'EDIÇÃO #01 • CITOLOGIA',
    tag: 'BIOENERGÉTICA',
    titulo: 'Por que a mitocôndria tem DNA próprio e dupla membrana?',
    resumo: 'A teoria endossimbiótica propõe que uma célula hospedeira ancestral englobou uma bactéria aeróbica sem digeri-la. Com o tempo, o endossimbionte passou a fornecer ATP em troca de proteção e nutrientes, integrando-se ao metabolismo celular.',
    detalheTecnico: 'A membrana externa guarda traços da vesícula hospedeira, enquanto a membrana interna — rica em cardiolipina e dobrada em cristas — preserva semelhanças com membranas bacterianas, abrigando a cadeia transportadora de elétrons e a ATP sintase.',
    referencia: 'Alberts et al., Biologia Molecular da Célula (NCBI Bookshelf)',
    url: 'https://www.ncbi.nlm.nih.gov/books/NBK26882/'
  },
  {
    id: 'endomembranas',
    edicao: 'EDIÇÃO #02 • TRÁFEGO CELULAR',
    tag: 'SECRETORA',
    titulo: 'Retículo endoplasmático e Complexo de Golgi: a rota das proteínas',
    resumo: 'Proteínas destinadas à membrana plasmática, lisossomos ou secreção extracelular iniciam a tradução em ribossomos associados ao retículo endoplasmático rugoso (RER) e seguem em vesículas até o Complexo de Golgi.',
    detalheTecnico: 'No lúmen do RER ocorrem dobramento assistido por chaperonas e glicosilação inicial; no Golgi (faces cis, medial e trans), cadeias de oligossacarídeos são remodeladas e endereçadas por sinais moleculares específicos.',
    referencia: 'Lodish et al., Molecular Cell Biology (NCBI Bookshelf)',
    url: 'https://www.ncbi.nlm.nih.gov/books/NBK21470/'
  },
  {
    id: 'citoesqueleto',
    edicao: 'EDIÇÃO #03 • ARQUITETURA',
    tag: 'DINÂMICA CELULAR',
    titulo: 'Citoesqueleto e motores moleculares: estradas dentro da célula',
    resumo: 'Microtúbulos, filamentos intermediários e filamentos de actina mantêm a forma celular, organizam organelas e permitem o transporte direcionado de vesículas em vez de depender apenas da difusão aleatória.',
    detalheTecnico: 'Proteínas motoras como cinesinas e dineínas caminham sobre microtúbulos hidrolisando ATP, enquanto miosinas atuam sobre filamentos de actina em movimentos como contração e transporte cortical.',
    referencia: 'Cooper, G. M., The Cell: A Molecular Approach (NCBI Bookshelf)',
    url: 'https://www.ncbi.nlm.nih.gov/books/NBK9960/'
  }
];

const DISCIPLINE_JOURNAL_ARTICLES = {
  anatomia: [
    {
      id: 'anat_coronarias',
      iconePixel: 'coracao',
      edicao: 'GAZETA ANATÔMICA #01',
      tag: 'HEMODINÂMICA',
      titulo: 'Como o coração irriga a si mesmo durante o ciclo cardíaco',
      resumo: 'O miocárdio possui altíssima demanda metabólica contínua e é irrigado pelas artérias coronárias direita e esquerda, que nascem logo acima da valva aórtica.',
      detalheTecnico: 'No ventrículo esquerdo, a forte compressão sistólica reduz o fluxo coronário intramural durante a contração, tornando a diástole ventricular o momento principal de perfusão dessa parede.',
      referencia: 'Hall, J. E., Guyton and Hall Textbook of Medical Physiology',
      url: 'https://www.ncbi.nlm.nih.gov/books/NBK547710/'
    },
    {
      id: 'anat_nefron',
      iconePixel: 'rim',
      edicao: 'GAZETA ANATÔMICA #02',
      tag: 'HOMEOSTASE',
      titulo: 'O néfron e o controle fino de água e solutos no sangue',
      resumo: 'Cada rim humano contém cerca de um milhão de néfrons, unidades funcionais que filtram o plasma no glomérulo e ajustam a composição final da urina ao longo dos túbulos.',
      detalheTecnico: 'O mecanismo multiplicador em contracorrente na alça de néfron cria um gradiente osmótico medular que permite ao ducto coletor reabsorver água sob controle do hormônio antidiurético (ADH).',
      referencia: 'StatPearls — Physiology, Kidney, Glomerular Filtration (NCBI)',
      url: 'https://www.ncbi.nlm.nih.gov/books/NBK507821/'
    }
  ],
  evolucao: [
    {
      id: 'evo_selecao_deriva',
      iconePixel: 'clado',
      edicao: 'GAZETA EVOLUTIVA #01',
      tag: 'GENÉTICA POPULACIONAL',
      titulo: 'Adaptação por seleção natural versus acaso da deriva genética',
      resumo: 'A evolução ocorre quando frequências alélicas mudam entre gerações. Enquanto a seleção natural filtra variantes ligadas ao sucesso reprodutivo, a deriva age por amostragem aleatória.',
      detalheTecnico: 'Em populações pequenas ou após gargalos demográficos, alelos neutros ou levemente deletérios podem fixar-se ou perder-se independentemente de seu valor adaptativo.',
      referencia: 'Stanford Encyclopedia of Philosophy — Evolutionary Theory',
      url: 'https://plato.stanford.edu/entries/evolution/'
    }
  ],
  nervoso: [
    {
      id: 'neuro_potencial',
      iconePixel: 'neuronio',
      edicao: 'GAZETA NEURAL #01',
      tag: 'ELETROFISIOLOGIA',
      titulo: 'Canais iônicos voltagem-dependentes e a dinâmica do impulso nervoso',
      resumo: 'O potencial de ação é um sinal elétrico de amplitude constante que propaga informações ao longo do axônio sem perder intensidade.',
      detalheTecnico: 'A abertura rápida de canais de Na⁺ despolariza a membrana, seguida pela inativação desses canais e abertura de canais de K⁺ que restauram o potencial de repouso.',
      referencia: 'Purves et al., Neuroscience, 2nd ed. (NCBI Bookshelf)',
      url: 'https://www.ncbi.nlm.nih.gov/books/NBK10991/'
    }
  ],
  digestorio: [
    {
      id: 'dig_digestao_enzimatica',
      iconePixel: 'digestao',
      edicao: 'GAZETA FISIOLÓGICA #01',
      tag: 'ENZIMOLOGIA',
      titulo: 'Compartimentalização do pH e ativação de zimogênios digestivos',
      resumo: 'O trato gastrointestinal organiza etapas sequenciais de quebra mecânica e química para converter polímeros alimentares em moléculas absorvíveis.',
      detalheTecnico: 'Muitas proteases são secretadas como precursores inativos (zimogênios, como pepsinogênio e tripsinogênio) para evitar a autodigestão das células que as produzem.',
      referencia: 'StatPearls — Physiology, Digestion (NCBI Bookshelf)',
      url: 'https://www.ncbi.nlm.nih.gov/books/NBK544242/'
    }
  ],
  zoologia: [
    {
      id: 'zoo_amniotas',
      iconePixel: 'zoo',
      edicao: 'GAZETA ZOOLÓGICA #01',
      tag: 'DIVERSIDADE ANIMAL',
      titulo: 'Membranas extraembrionárias e a conquista da terra firme',
      resumo: 'A transição dos vertebrados para ambientes terrestres exigiu soluções contra a dessecação e para trocas gasosas e metabólicas fora da água.',
      detalheTecnico: 'Âmnio, cório, alantoide e saco vitelínico formam o sistema de anexos embrionários característico dos amniotas (répteis, aves e mamíferos).',
      referencia: 'Tree of Life Web Project — Amniota',
      url: 'http://tolweb.org/Amniota/14990'
    }
  ],
  botanica: [
    {
      id: 'bot_fotossintese',
      iconePixel: 'planta',
      edicao: 'GAZETA BOTÂNICA #01',
      tag: 'FISIOLOGIA VEGETAL',
      titulo: 'Da fotólise da água ao Ciclo de Calvin nos cloroplastos',
      resumo: 'As plantas convertem energia luminosa em energia química armazenada em carboidratos, sustentando a maior parte das cadeias tróficas terrestres.',
      detalheTecnico: 'Na fase clara, elétrons retirados da água movem-se pelos fotossistemas II e I gerando ATP e NADPH; no estroma, a enzima RuBisCO inicia a fixação de carbono.',
      referencia: 'Alberts et al., Molecular Biology of the Cell — Chloroplasts (NCBI)',
      url: 'https://www.ncbi.nlm.nih.gov/books/NBK26819/'
    }
  ],
  bioquimica: [
    {
      id: 'bioq_enzimas_atp',
      iconePixel: 'bioq',
      edicao: 'GAZETA BIOQUÍMICA #01',
      tag: 'BIOENERGÉTICA',
      titulo: 'Como enzimas aceleram reações e o papel do ATP como moeda energética',
      resumo: 'As reações celulares ocorrem em temperaturas suaves e exigem catalisadores altamente específicos para acontecer em escalas de tempo compatíveis com a vida.',
      detalheTecnico: 'Enzimas reduzem a energia de ativação estabilizando o estado de transição, enquanto a hidrólise do ATP acopla-se a reações endergônicas desfavoráveis.',
      referencia: 'Berg, Tymoczko & Stryer, Biochemistry, 5th ed. (NCBI Bookshelf)',
      url: 'https://www.ncbi.nlm.nih.gov/books/NBK22447/'
    }
  ]
};

const FALLBACK_CELULAR = {
  tiposCelula: {
    animal: {
      nome: 'Célula Animal Eucariótica',
      descricao: 'Célula eucariótica sem parede celular rígida nem cloroplastos, dotada de membrana plasmática flexível e compartimentos membranosos.',
      organelas: [
        { id: 'membrana', nome: 'Membrana Plasmática', analogia: 'Fronteira seletiva', funcao: 'Controla trocas de substâncias e recebe sinais químicos.', curiosidade: 'Composta por bicamada fosfolipídica fluida com proteínas e colesterol.', referencia: 'Alberts et al., Biologia Molecular da Célula.' },
        { id: 'nucleo', nome: 'Núcleo Celular', analogia: 'Centro de comando genético', funcao: 'Protege o DNA e regula a expressão gênica.', curiosidade: 'O nucléolo monta subunidades ribossomais.', referencia: 'Lodish et al., Biologia Celular e Molecular.' },
        { id: 'reticulo', nome: 'Retículo Endoplasmático', analogia: 'Linha de produção e lipídios', funcao: 'RER sintetiza proteínas; REL produz lipídios e armazena Ca²⁺.', curiosidade: 'Células musculares têm REL especializado chamado retículo sarcoplasmático.', referencia: 'Alberts et al., Biologia Molecular da Célula.' },
        { id: 'mitocondria', nome: 'Mitocôndria', analogia: 'Usina de ATP', funcao: 'Realiza respiração celular aeróbica e fosforilação oxidativa.', curiosidade: 'Possui DNA circular próprio e dupla membrana.', referencia: 'Nelson & Cox, Lehninger Principles of Biochemistry.' },
        { id: 'golgi', nome: 'Complexo de Golgi', analogia: 'Centro de triagem e endereçamento', funcao: 'Modifica, empacota e distribui proteínas e lipídios.', curiosidade: 'Forma lisossomos e vesículas secretoras.', referencia: 'Lodish et al., Biologia Celular e Molecular.' },
        { id: 'lisossomo', nome: 'Lisossomo', analogia: 'Reciclagem digestiva', funcao: 'Contém hidrolases ácidas para digestão intracelular e autofagia.', curiosidade: 'Mantém pH interno ácido (~5) por bombas de prótons.', referencia: 'Alberts et al., Biologia Molecular da Célula.' }
      ]
    },
    vegetal: {
      nome: 'Célula Vegetal Eucariótica',
      descricao: 'Apresenta parede celular celulósica, cloroplastos fotossintéticos e grande vacúolo central.',
      organelas: [
        { id: 'parede', nome: 'Parede Celular', analogia: 'Armadura estrutural', funcao: 'Confere rigidez mecânica e resiste à pressão de turgor.', curiosidade: 'Rica em microfibrilas de celulose.', referencia: 'Raven, Evert & Eichhorn, Biologia Vegetal.' },
        { id: 'vacuolo', nome: 'Vacúolo Central', analogia: 'Reservatório e regulador osmótico', funcao: 'Armazena água, íons e pigmentos e mantém o turgor.', curiosidade: 'Pode ocupar até 80% ou mais do volume celular.', referencia: 'Taiz & Zeiger, Fisiologia Vegetal.' },
        { id: 'nucleo_veg', nome: 'Núcleo Celular', analogia: 'Arquivo genético', funcao: 'Armazena o genoma nuclear e coordena a transcrição.', curiosidade: 'Frequentemente deslocado para a periferia pelo vacúolo.', referencia: 'Raven, Evert & Eichhorn, Biologia Vegetal.' },
        { id: 'cloroplasto', nome: 'Cloroplasto', analogia: 'Painel solar bioquímico', funcao: 'Converte energia luminosa em energia química (fotossíntese).', curiosidade: 'Contém tilacoides onde ocorre a fase fotoquímica.', referencia: 'Taiz & Zeiger, Fisiologia Vegetal.' }
      ]
    },
    procarionte: {
      nome: 'Célula Procarionte (Bactéria)',
      descricao: 'Célula sem carioteca nem organelas membranosas internas; DNA concentrado no nucleoide.',
      organelas: [
        { id: 'flagelo', nome: 'Flagelo Bacteriano', analogia: 'Motor rotatório', funcao: 'Promove locomoção em meio líquido.', curiosidade: 'Gira movido por gradiente de prótons.', referencia: 'Madigan et al., Microbiologia de Brock.' },
        { id: 'nucleoide', nome: 'Nucleoide', analogia: 'Cromossomo circular condensado', funcao: 'Contém a informação genética principal da bactéria.', curiosidade: 'Não é envolvido por envelope nuclear.', referencia: 'Madigan et al., Microbiologia de Brock.' },
        { id: 'plasmideo', nome: 'Plasmídeo', analogia: 'DNA acessório portátil', funcao: 'Carrega genes adicionais, como resistência a antibióticos.', curiosidade: 'Pode ser transferido entre bactérias por conjugação.', referencia: 'Tortora, Microbiologia.' },
        { id: 'ribossomo_prok', nome: 'Ribossomos (70S)', analogia: 'Fábrica de proteínas', funcao: 'Traduz RNA mensageiro em cadeias polipeptídicas.', curiosidade: 'Alvo seletivo de vários antibióticos bacterianos.', referencia: 'Madigan et al., Microbiologia de Brock.' }
      ]
    }
  }
};

const FALLBACK_DISCIPLINAS = {
  disciplinas: {
    anatomia: {
      titulo: 'Anatomia Humana',
      icone: '🦴',
      subtitulo: 'Organização estrutural, sistemas orgânicos e correlações clínicas',
      cor: '#E63946',
      submaterias: [
        { id: 'locomotor', nome: 'Esqueleto, Articulações & Músculos', resumoDetalhado: 'Integra ossos, articulações e músculos estriados esqueléticos para sustentação, proteção e movimento.', mecanismo: 'A acetilcolina despolariza o sarcolema e libera Ca²⁺, permitindo o deslizamento entre actina e miosina.', exemploClinico: 'A perda de massa óssea na osteoporose eleva o risco de fraturas.', referencia: 'Moore, Dalley & Agur, Anatomia Orientada para a Clínica.' }
      ],
      topicos: [
        { titulo: 'Circulação Dupla', resumo: 'Separa a circulação pulmonar da sistêmica em um coração tetracavitário.', destaque: 'As veias pulmonares trazem sangue oxigenado ao átrio esquerdo.', referencia: 'Tortora & Derrickson.' }
      ],
      quizzes: [
        { pergunta: 'Qual vaso traz sangue oxigenado dos pulmões para o átrio esquerdo?', opcoes: ['Artéria pulmonar', 'Veia cava', 'Veias pulmonares', 'Aorta'], correta: 2, explicacao: 'As veias pulmonares chegam ao coração transportando sangue arterial.' }
      ]
    },
    evolucao: {
      titulo: 'Evolução Biológica',
      icone: '🦍',
      subtitulo: 'Seleção natural, genética populacional e filogenia',
      cor: '#FFB703',
      submaterias: [
        { id: 'genetica_populacional', nome: 'Seleção Natural & Genética de Populações', resumoDetalhado: 'Evolução é a mudança nas frequências alélicas de uma geração para outra.', mecanismo: 'Seleção, mutação, migração e deriva desviam frequências do equilíbrio de Hardy-Weinberg.', exemploClinico: 'Resistência bacteriana a antibióticos.', referencia: 'Futuyma & Kirkpatrick, Evolution.' }
      ],
      topicos: [
        { titulo: 'Deriva Genética', resumo: 'Mudança aleatória nas frequências alélicas, marcante em populações pequenas.', destaque: 'Inclui efeitos gargalo e fundador.', referencia: 'Ridley, Evolução.' }
      ],
      quizzes: [
        { pergunta: 'Qual processo altera frequências alélicas ao acaso em populações pequenas?', opcoes: ['Deriva genética', 'Seleção estabilizadora', 'Poliploidia', 'Mimetismo'], correta: 0, explicacao: 'A deriva genética tem efeito estocástico mais intenso em populações reduzidas.' }
      ]
    },
    nervoso: {
      titulo: 'Sistema Nervoso',
      icone: '🧠',
      subtitulo: 'Eletrofisiologia, sinapses e neuroanatomia',
      cor: '#8338EC',
      submaterias: [
        { id: 'eletrofisiologia_sinapses', nome: 'Potencial de Ação e Sinapses', resumoDetalhado: 'Neurônios transmitem sinais elétricos e químicos.', mecanismo: 'Influxo rápido de Na⁺ despolariza a membrana; efluxo de K⁺ repolariza.', exemploClinico: 'Anestésicos locais bloqueiam canais de Na⁺.', referencia: 'Bear, Connors & Paradiso, Neurociências.' }
      ],
      topicos: [
        { titulo: 'Condução Saltatória', resumo: 'Impulso salta entre Nódulos de Ranvier em fibras mielinizadas.', destaque: 'Aumenta a velocidade de condução.', referencia: 'Kandel et al.' }
      ],
      quizzes: [
        { pergunta: 'Qual íon entra rapidamente para iniciar a despolarização do potencial de ação?', opcoes: ['Cl⁻', 'Na⁺', 'K⁺', 'Mg²⁺'], correta: 1, explicacao: 'A abertura de canais de sódio dependentes de voltagem inicia a despolarização.' }
      ]
    },
    digestorio: {
      titulo: 'Sistema Digestório',
      icone: '🍎',
      subtitulo: 'Enzimologia, absorção e fisiologia gastrointestinal',
      cor: '#FB5607',
      submaterias: [
        { id: 'enzimas_ph', nome: 'Enzimas e pH Digestivo', resumoDetalhado: 'Quebra macromoléculas em monômeros absorvíveis.', mecanismo: 'Pepsina atua em pH ácido no estômago; enzimas pancreáticas atuam no duodeno.', exemploClinico: 'Deficiência biliar ou pancreática prejudica a digestão de gorduras.', referencia: 'Guyton & Hall.' }
      ],
      topicos: [
        { titulo: 'Bile e Emulsificação', resumo: 'Sais biliares dispersam lipídios em gotículas menores.', destaque: 'A bile não contém enzimas digestivas.', referencia: 'Silverthorn, Fisiologia Humana.' }
      ],
      quizzes: [
        { pergunta: 'Qual é o papel dos sais biliares na digestão?', opcoes: ['Digerir amido', 'Emulsificar gorduras', 'Ativar pepsinogênio', 'Absorver água'], correta: 1, explicacao: 'Aumentam a superfície de contato dos lipídios para a lipase.' }
      ]
    },
    zoologia: {
      titulo: 'Zoologia Comparada',
      icone: '🦎',
      subtitulo: 'Diversidade animal, invertebrados e cordados',
      cor: '#00A896',
      submaterias: [
        { id: 'cordados_vertebrados', nome: 'Cordados e Vertebrados', resumoDetalhado: 'Cordados possuem notocorda, tubo neural dorsal, fendas faringianas e cauda pós-anal.', mecanismo: 'O ovo amniótico permitiu independência reprodutiva da água em amniotas.', exemploClinico: 'Linha lateral detecta vibrações na água.', referencia: 'Pough, Janis & Heiser.' }
      ],
      topicos: [
        { titulo: 'Protostômios vs. Deuterostômios', resumo: 'Classificação ligada ao desenvolvimento embrionário.', destaque: 'Equinodermos e cordados são deuterostômios.', referencia: 'Brusca, Moore & Shuster.' }
      ],
      quizzes: [
        { pergunta: 'Qual estrutura permitiu independência da água na reprodução dos amniotas?', opcoes: ['Brânquias', 'Ovo amniótico', 'Linha lateral', 'Bexiga natatória'], correta: 1, explicacao: 'O ovo amniótico protege e hidrata o embrião em terra firme.' }
      ]
    },
    botanica: {
      titulo: 'Botânica',
      icone: '🌿',
      subtitulo: 'Ciclos de vida, fotossíntese e transporte vegetal',
      cor: '#8AC926',
      submaterias: [
        { id: 'ciclos_grupos_vegetais', nome: 'Ciclos de Vida e Grupos Vegetais', resumoDetalhado: 'Alternância entre gametófito (n) e esporófito (2n).', mecanismo: 'Vasos lenhosos (xilema) e liberianos (floema) conduzem seivas nas traqueófitas.', exemploClinico: 'Estômatos regulam transpiração e trocas gasosas.', referencia: 'Raven, Evert & Eichhorn.' }
      ],
      topicos: [
        { titulo: 'Coesão-Tensão', resumo: 'A transpiração foliar puxa a coluna de água pelo xilema.', destaque: 'Depende da coesão entre moléculas de água.', referencia: 'Taiz & Zeiger.' }
      ],
      quizzes: [
        { pergunta: 'Qual tecido conduz seiva bruta (água e sais)?', opcoes: ['Floema', 'Xilema', 'Colênquima', 'Súber'], correta: 1, explicacao: 'O xilema transporta água e minerais das raízes às folhas.' }
      ]
    },
    bioquimica: {
      titulo: 'Bioquímica & Biofísica',
      icone: '⚗️',
      subtitulo: 'Enzimas, bioenergética e osmose',
      cor: '#3A86FF',
      submaterias: [
        { id: 'enzimas_metabolismo', nome: 'Enzimas e Bioenergética', resumoDetalhado: 'Enzimas aceleram reações bioquímicas sem alterar o ΔG.', mecanismo: 'Reduzem a energia de ativação estabilizando o estado de transição.', exemploClinico: 'Osmose move água do meio hipotônico para o hipertônico.', referencia: 'Nelson & Cox, Lehninger.' }
      ],
      topicos: [
        { titulo: 'Osmose e Tonicidade', resumo: 'Movimento líquido de água através de membrana semipermeável.', destaque: 'Meios hipotônicos podem causar lise celular.', referencia: 'Heneine, Biofísica Básica.' }
      ],
      quizzes: [
        { pergunta: 'Como uma enzima acelera uma reação?', opcoes: ['Aumenta ΔG', 'Reduz a energia de ativação', 'Altera o equilíbrio', 'É consumida'], correta: 1, explicacao: 'Enzimas diminuem a barreira de energia de ativação.' }
      ]
    }
  }
};

const SCALE_REFERENCE_OBJECTS = [
  { nome: 'Fio de Cabelo (espessura)', um: 70, cor: '#FFB703', tipo: 'barra', instrumento: 'Microscópio Óptico / Lupa', desc: 'Um fio de cabelo humano típico tem cerca de 70 µm de diâmetro. Ao aumentar o zoom, você vê como ele é colossal perto de uma célula ou bactéria.' },
  { nome: 'Célula Eucariótica (ex.: Epitélio/Macrófago)', um: 25, cor: '#00A896', tipo: 'celula', instrumento: 'Microscópio Óptico', desc: 'Ao aproximar a escala, você entra no domínio celular: membrana, citoplasma e núcleo ganham proporção real frente ao fio de cabelo.' },
  { nome: 'Bactéria (ex.: E. coli)', um: 2, cor: '#FB5607', tipo: 'circulo', instrumento: 'Microscópio Óptico de Imersão', desc: 'Com cerca de 2 µm de comprimento, uma bactéria é cerca de 12x menor que uma célula animal típica e muito menor que a largura de um fio de cabelo.' },
  { nome: 'Partícula Viral (ex.: Influenza)', um: 0.1, cor: '#8338EC', tipo: 'circulo', instrumento: 'Microscópio Eletrônico', desc: 'Em torno de 100 nm (0,1 µm), vírus ficam abaixo do limite de resolução da luz visível comum.' },
  { nome: 'Dupla Hélice de DNA (largura)', um: 0.0025, cor: '#3A86FF', tipo: 'circulo', instrumento: 'Microscópio Eletrônico / Cristalografia', desc: 'Escala molecular: ~2,5 nm de largura. O código genético em escala nanométrica.' }
];

const HEART_DATA = {
  ad: { nome: 'Átrio Direito (AD)', tipoSangue: 'Venoso (Pobre em O₂)', corBadge: 'bg-blue-700 text-white', trajeto: 'Recebe sangue venoso de todo o corpo pelas Veias Cavas Superior e Inferior e o impulsiona através da Valva Tricúspide para o Ventrículo Direito.', pressao: '0 a 8 mmHg (Baixa pressão)', ref: 'Tortora & Derrickson, Princípios de Anatomia e Fisiologia.' },
  vd: { nome: 'Ventrículo Direito (VD)', tipoSangue: 'Venoso (Pobre em O₂)', corBadge: 'bg-blue-700 text-white', trajeto: 'Bombeia o sangue venoso através da Valva Pulmonar para o Tronco Pulmonar rumo aos alvéolos, onde ocorrerá a hematose.', pressao: '25 / 0-5 mmHg (Circulação Pulmonar)', ref: 'Guyton & Hall, Tratado de Fisiologia Médica.' },
  pulmoes: { nome: 'Capilares Pulmonares (Hematose)', tipoSangue: 'Troca Gasosa (Venoso → Arterial)', corBadge: 'bg-purple-700 text-white', trajeto: 'Nos alvéolos pulmonares, o CO₂ difunde-se para o ar expirado e o O₂ liga-se à hemoglobina. O sangue retorna ao coração pelas 4 Veias Pulmonares.', pressao: '~15 mmHg', ref: 'Silverthorn, Fisiologia Humana.' },
  ae: { nome: 'Átrio Esquerdo (AE)', tipoSangue: 'Arterial (Rico em O₂)', corBadge: 'bg-red-600 text-white', trajeto: 'Recebe sangue recém-oxigenado das veias pulmonares e o envia através da Valva Mitral (Bicúspide) para o Ventrículo Esquerdo.', pressao: '4 a 12 mmHg', ref: 'Moore, Anatomia Orientada para a Clínica.' },
  ve: { nome: 'Ventrículo Esquerdo (VE)', tipoSangue: 'Arterial (Rico em O₂)', corBadge: 'bg-red-600 text-white', trajeto: 'Possui a parede miocárdica mais espessa (~1,5 cm). Ejeta sangue pela Valva Aórtica na Artéria Aorta para irrigar todo o organismo.', pressao: '120 / 0-8 mmHg (Circulação Sistêmica)', ref: 'Netter, Atlas de Anatomia Humana.' }
};

const CLADOGRAM_DATA = {
  gnathostomata: { no: 'Nó 1: Mandíbulas Articuladas (Gnathostomata)', sinapomorfia: 'Arcos faríngeos anteriores modificados em mandíbulas com dentes.', grupoEmergente: 'Peixes Cartilaginosos e Ósseos', impacto: 'Permitiu a predação ativa de presas grandes, substituindo a alimentação passiva por filtração dos agnatos ancestrais.', ref: 'Pough, Janis & Heiser, A Vida dos Vertebrados.' },
  tetrapoda: { no: 'Nó 2: Membros Locomotores e Pulmões (Tetrapoda)', sinapomorfia: 'Nadadeiras lobadas modificadas em membros com dígitos (quirídios) e cintura pélvica fundida à coluna.', grupoEmergente: 'Anfíbios (Sapos, Salamandras, Cecílias)', impacto: 'Possibilitou a locomoção em terra firme, embora anfíbios ainda dependam da água para reprodução e respiração cutânea.', ref: 'Futuyma, Biologia Evolutiva.' },
  amniota: { no: 'Nó 3: Ovo Amniótico e Pele Queratinizada (Amniota)', sinapomorfia: 'Embrião envolto por âmnio, cório, alantoide e saco vitelínico, protegido por casca.', grupoEmergente: 'Répteis e Aves (Sauropsida)', impacto: 'Conquista definitiva do ambiente terrestre seco, eliminando a necessidade de ambientes aquáticos para desova.', ref: 'Ridley, Evolução, 3ª ed.' },
  mammalia: { no: 'Nó 4: Pelos, Glândulas Mamárias e Endotermia (Mammalia)', sinapomorfia: 'Produção de leite, pelos de queratina, diafragma muscular e três ossículos na orelha média (martelo, bigorna, estribo).', grupoEmergente: 'Mamíferos (Monotremados, Marsupiais e Placentários)', impacto: 'Alto metabolismo endotérmico permitiu atividade noturna e ocupação de climas frios após a extinção dos dinossauros não-avianos.', ref: 'Benton, Paleontologia dos Vertebrados.' }
};

async function init() {
  try {
    const [celRes, discRes] = await Promise.all([
      fetch('dados/celular.json'),
      fetch('dados/disciplinas.json')
    ]);
    if (!celRes.ok || !discRes.ok) throw new Error('HTTP error');
    state.celularData = await celRes.json();
    state.disciplinasData = await discRes.json();
  } catch (err) {
    state.celularData = FALLBACK_CELULAR;
    state.disciplinasData = FALLBACK_DISCIPLINAS;
  }

  state.selectedOrganelle = state.celularData.tiposCelula.animal.organelas[0];
  renderSidebar();
  renderBadges();
  renderCurrentView();
}

function renderSidebar() {
  const nav = document.getElementById('sidebar-menu');
  if (!nav) return;
  nav.innerHTML = MENU_ITEMS.map(item => {
    const active = state.currentTab === item.id;
    return `
      <button onclick="switchTab('${item.id}')"
        class="shrink-0 lg:shrink lg:w-full text-left px-2.5 py-2 font-mono text-xs font-bold border-2 border-black flex items-center gap-2 transition-transform active:translate-y-0.5
        ${active ? 'bg-retroBlue text-white shadow-retroSm' : 'bg-retroWin text-black shadow-winBevel hover:bg-white'}">
        <span>${item.icon}</span>
        <span class="whitespace-nowrap lg:truncate">${item.label}</span>
      </button>
    `;
  }).join('');
}

function renderBadges() {
  const badgeItems = MENU_ITEMS.filter(m => m.badge);
  const counterEl = document.getElementById('badge-counter');
  if (counterEl) {
    counterEl.textContent = `🏆 ${state.unlockedBadges.length}/${badgeItems.length} • ✅ ${state.correctAnswersCount}`;
  }

  const grid = document.getElementById('badges-grid');
  if (!grid) return;
  grid.innerHTML = badgeItems.map(item => {
    const unlocked = state.unlockedBadges.includes(item.id);
    return `
      <div title="${item.badge} (${unlocked ? 'Desbloqueada!' : 'Complete o quiz desta área'})"
        class="p-1.5 border border-black text-lg ${unlocked ? 'bg-retroAmber shadow-retroSm' : 'bg-gray-300 opacity-40 grayscale'}">
        ${item.icon}
      </div>
    `;
  }).join('');
}

function unlockBadge(id) {
  if (!state.unlockedBadges.includes(id)) {
    state.unlockedBadges.push(id);
    localStorage.setItem('bioos_badges', JSON.stringify(state.unlockedBadges));
    renderBadges();
  }
}

function incrementCorrectCount() {
  state.correctAnswersCount += 1;
  localStorage.setItem('bioos_correct_count', String(state.correctAnswersCount));
  renderBadges();
}

function resetProgress() {
  localStorage.removeItem('bioos_badges');
  localStorage.removeItem('bioos_correct_count');
  localStorage.removeItem('bioos_mastered_cards');
  state.unlockedBadges = [];
  state.correctAnswersCount = 0;
  state.masteredCards = [];
  renderBadges();
  renderCurrentView();
  alert('Progresso de medalhas, acertos e flashcards resetado!');
}

function switchTab(tabId) {
  state.currentTab = tabId;
  state.selectedSubmatterId = null;
  state.flashcardFlipped = false;
  const statusEl = document.getElementById('status-bar');
  if (statusEl) statusEl.textContent = `Módulo ativo: ${tabId.toUpperCase()}`;
  renderSidebar();
  renderCurrentView();
}

function openSubmatter(submatterId) {
  state.selectedSubmatterId = submatterId;
  const statusEl = document.getElementById('status-bar');
  if (statusEl) statusEl.textContent = `Submatéria aberta: ${submatterId}`;
  renderCurrentView();
}

function closeSubmatter() {
  state.selectedSubmatterId = null;
  const statusEl = document.getElementById('status-bar');
  if (statusEl) statusEl.textContent = `Módulo ativo: ${state.currentTab.toUpperCase()}`;
  renderCurrentView();
}

function renderCurrentView() {
  const main = document.getElementById('main-content');
  if (!main) return;
  if (state.currentTab === 'celular') {
    renderCelularView(main);
  } else if (state.currentTab === 'flashcards') {
    renderFlashcardsView(main);
  } else if (state.currentTab === 'noticias') {
    renderNoticiasNobelView(main);
  } else if (state.selectedSubmatterId) {
    renderSubmatterScreen(main, state.currentTab, state.selectedSubmatterId);
  } else {
    renderDisciplinaView(main, state.currentTab);
  }
}

/* =========================================================
   ILUSTRAÇÕES PIXELADAS & SEÇÃO ESTILO JORNAL CIENTÍFICO
   ========================================================= */
function getJournalPixelIllustration(id) {
  if (id === 'endossimbiose' || id === 'bioq_enzimas_atp') {
    return `
      <svg viewBox="0 0 96 96" shape-rendering="crispEdges" class="w-24 h-24 sm:w-28 sm:h-28 border-2 border-black bg-[#102a43] shrink-0">
        <rect x="8" y="20" width="80" height="56" fill="#d97706" />
        <rect x="14" y="26" width="68" height="44" fill="#fef3c7" />
        <rect x="20" y="34" width="56" height="28" fill="#fb5607" />
        <rect x="26" y="40" width="44" height="16" fill="#ffb703" />
        <rect x="30" y="44" width="8" height="8" fill="#fb5607" />
        <rect x="44" y="44" width="8" height="8" fill="#fb5607" />
        <rect x="58" y="44" width="8" height="8" fill="#fb5607" />
        <rect x="64" y="12" width="12" height="12" fill="#8338ec" />
        <rect x="68" y="16" width="4" height="4" fill="#ffffff" />
      </svg>
    `;
  }
  if (id === 'endomembranas' || id === 'dig_digestao_enzimatica') {
    return `
      <svg viewBox="0 0 96 96" shape-rendering="crispEdges" class="w-24 h-24 sm:w-28 sm:h-28 border-2 border-black bg-[#1b263b] shrink-0">
        <rect x="12" y="18" width="34" height="10" fill="#3a86ff" />
        <rect x="16" y="32" width="34" height="10" fill="#3a86ff" />
        <rect x="12" y="46" width="34" height="10" fill="#3a86ff" />
        <rect x="14" y="14" width="4" height="4" fill="#ffb703" />
        <rect x="24" y="14" width="4" height="4" fill="#ffb703" />
        <rect x="34" y="14" width="4" height="4" fill="#ffb703" />
        <rect x="56" y="24" width="24" height="8" fill="#00a896" />
        <rect x="56" y="36" width="24" height="8" fill="#00a896" />
        <rect x="56" y="48" width="24" height="8" fill="#00a896" />
        <rect x="62" y="66" width="14" height="14" fill="#8ac926" />
      </svg>
    `;
  }
  if (id === 'anat_coronarias' || id === 'anat_nefron') {
    return `
      <svg viewBox="0 0 96 96" shape-rendering="crispEdges" class="w-24 h-24 sm:w-28 sm:h-28 border-2 border-black bg-[#2b0909] shrink-0">
        <rect x="28" y="12" width="10" height="20" fill="#3a86ff" />
        <rect x="58" y="12" width="10" height="20" fill="#e63946" />
        <rect x="20" y="30" width="56" height="42" fill="#e63946" />
        <rect x="26" y="36" width="18" height="24" fill="#60a5fa" />
        <rect x="52" y="36" width="18" height="28" fill="#f87171" />
        <rect x="38" y="72" width="20" height="10" fill="#ffb703" />
      </svg>
    `;
  }
  if (id === 'neuro_potencial') {
    return `
      <svg viewBox="0 0 96 96" shape-rendering="crispEdges" class="w-24 h-24 sm:w-28 sm:h-28 border-2 border-black bg-[#160d29] shrink-0">
        <rect x="14" y="26" width="22" height="22" fill="#8338ec" />
        <rect x="20" y="32" width="10" height="10" fill="#ffb703" />
        <rect x="36" y="35" width="44" height="6" fill="#e2e8f0" />
        <rect x="46" y="31" width="6" height="14" fill="#00a896" />
        <rect x="62" y="31" width="6" height="14" fill="#00a896" />
        <rect x="78" y="28" width="8" height="20" fill="#fb5607" />
      </svg>
    `;
  }
  if (id === 'evo_selecao_deriva' || id === 'zoo_amniotas') {
    return `
      <svg viewBox="0 0 96 96" shape-rendering="crispEdges" class="w-24 h-24 sm:w-28 sm:h-28 border-2 border-black bg-[#10251c] shrink-0">
        <rect x="16" y="72" width="64" height="8" fill="#ffb703" />
        <rect x="24" y="48" width="8" height="24" fill="#8ac926" />
        <rect x="44" y="32" width="8" height="40" fill="#00a896" />
        <rect x="64" y="18" width="8" height="54" fill="#3a86ff" />
        <rect x="62" y="14" width="12" height="6" fill="#ffffff" />
      </svg>
    `;
  }
  if (id === 'bot_fotossintese') {
    return `
      <svg viewBox="0 0 96 96" shape-rendering="crispEdges" class="w-24 h-24 sm:w-28 sm:h-28 border-2 border-black bg-[#0b2e1d] shrink-0">
        <rect x="64" y="12" width="16" height="16" fill="#ffb703" />
        <rect x="44" y="54" width="8" height="28" fill="#a16207" />
        <rect x="24" y="34" width="20" height="14" fill="#8ac926" />
        <rect x="52" y="30" width="20" height="14" fill="#52b788" />
        <rect x="34" y="22" width="20" height="12" fill="#2d6a4f" />
      </svg>
    `;
  }
  return `
    <svg viewBox="0 0 96 96" shape-rendering="crispEdges" class="w-24 h-24 sm:w-28 sm:h-28 border-2 border-black bg-[#1e1b4b] shrink-0">
      <rect x="14" y="44" width="68" height="8" fill="#4ea8de" />
      <rect x="22" y="20" width="8" height="56" fill="#8ac926" />
      <rect x="66" y="20" width="8" height="56" fill="#8ac926" />
      <rect x="42" y="38" width="12" height="20" fill="#ffb703" />
      <rect x="44" y="40" width="8" height="6" fill="#e63946" />
    </svg>
  `;
}

function renderJournalColumnBlock(tituloSecao, artigos) {
  if (!Array.isArray(artigos) || artigos.length === 0) return '';
  return `
    <section class="bg-retroWin border-2 border-black p-4 shadow-retro space-y-4">
      <div class="border-b-2 border-black pb-2 flex flex-wrap justify-between items-center gap-2">
        <div>
          <h3 class="font-pixel text-[10px] sm:text-xs text-retroBlue">📰 ${tituloSecao}</h3>
          <p class="font-mono text-[11px] text-gray-700 mt-0.5">Leitura comentada com ilustração pixelada e fonte de referência</p>
        </div>
        <span class="font-mono text-[10px] bg-retroAmber px-2 py-0.5 border border-black font-bold">
          ${artigos.length} ${artigos.length === 1 ? 'COLUNA' : 'COLUNAS'}
        </span>
      </div>

      <div class="space-y-4">
        ${artigos.map(art => `
          <article class="bg-retroPaper border-2 border-black p-4 shadow-retroSm space-y-3">
            <div class="flex flex-wrap justify-between items-center gap-2 border-b border-black/30 pb-1.5">
              <span class="font-mono text-[10px] font-bold bg-black text-retroLime px-2 py-0.5">${art.edicao}</span>
              <span class="font-mono text-[10px] font-bold bg-white px-2 py-0.5 border border-black">${art.tag}</span>
            </div>

            <div class="flex flex-col sm:flex-row gap-4 items-start">
              ${getJournalPixelIllustration(art.id)}
              <div class="space-y-2 flex-1 min-w-0">
                <h4 class="font-bold text-base text-retroBlue leading-snug">${art.titulo}</h4>
                <p class="text-sm leading-relaxed text-gray-900">${art.resumo}</p>
                <div class="bg-white border-l-4 border-retroTeal p-2.5 text-xs leading-relaxed text-gray-800">
                  <strong>🔬 Aprofundamento:</strong> ${art.detalheTecnico}
                </div>
              </div>
            </div>

            <div class="pt-2 border-t border-black/20 flex flex-wrap justify-between items-center gap-2 font-mono text-[11px] text-gray-700">
              <span>📚 ${art.referencia}</span>
              ${art.url ? `
                <a href="${art.url}" target="_blank" rel="noopener noreferrer"
                  class="font-bold text-retroBlue underline hover:text-black">
                  Abrir referência ↗
                </a>
              ` : ''}
            </div>
          </article>
        `).join('')}
      </div>
    </section>
  `;
}

/* =========================================================
   MÓDULO FLASHCARDS INTERATIVOS
   ========================================================= */
function getFilteredFlashcards() {
  if (state.flashcardFilter === 'todas') return FLASHCARDS_DECK;
  return FLASHCARDS_DECK.filter(c => c.area === state.flashcardFilter);
}

function renderFlashcardsView(container) {
  const cards = getFilteredFlashcards();
  if (state.flashcardIndex >= cards.length) state.flashcardIndex = 0;
  const card = cards[state.flashcardIndex];
  const isMastered = state.masteredCards.includes(card.id);

  const filterOptions = [
    { id: 'todas', label: 'Todas' },
    ...MENU_ITEMS.filter(m => m.badge).map(m => ({ id: m.id, label: m.label }))
  ];

  container.innerHTML = `
    <div class="space-y-5">
      <div class="bg-retroBlue text-white p-4 border-2 border-black shadow-retro flex flex-wrap justify-between items-center gap-3">
        <div>
          <h2 class="font-pixel text-xs sm:text-sm md:text-base">🃏 MODO DE REVISÃO — FLASHCARDS</h2>
          <p class="font-mono text-xs mt-1 text-retroAmber">
            Dominados: ${state.masteredCards.length}/${FLASHCARDS_DECK.length} • Clique no cartão para virar
          </p>
        </div>
      </div>

      <div class="flex flex-wrap gap-1.5 bg-retroWin border-2 border-black p-2.5 shadow-retroSm">
        ${filterOptions.map(opt => `
          <button onclick="setFlashcardFilter('${opt.id}')"
            class="px-2.5 py-1 font-mono text-[11px] font-bold border border-black
            ${state.flashcardFilter === opt.id ? 'bg-retroAmber text-black' : 'bg-white text-black hover:bg-gray-100'}">
            ${opt.label}
          </button>
        `).join('')}
      </div>

      <div class="max-w-2xl mx-auto space-y-4">
        <div onclick="toggleFlipFlashcard()"
          class="cursor-pointer border-2 border-black shadow-retro p-6 min-h-[230px] flex flex-col justify-between transition-colors
          ${state.flashcardFlipped ? 'bg-[#e8f5e9]' : 'bg-white hover:bg-yellow-50'}">
          <div class="flex justify-between items-center gap-2 border-b border-black/20 pb-2">
            <span class="font-mono text-[11px] font-bold bg-retroWin px-2 py-0.5 border border-black">
              ${card.tag}
            </span>
            <span class="font-mono text-[11px] font-bold ${isMastered ? 'text-green-700' : 'text-gray-600'}">
              ${isMastered ? '✅ Dominado' : `Card ${state.flashcardIndex + 1} de ${cards.length}`}
            </span>
          </div>

          <div class="my-5 flex-1 flex items-center justify-center text-center">
            ${!state.flashcardFlipped ? `
              <p class="font-bold text-base sm:text-lg text-retroBlue leading-snug">${card.frente}</p>
            ` : `
              <div class="space-y-2">
                <span class="font-pixel text-[9px] bg-retroLime px-2 py-0.5 border border-black">RESPOSTA</span>
                <p class="text-sm sm:text-base text-gray-900 leading-relaxed">${card.verso}</p>
              </div>
            `}
          </div>

          <div class="text-center font-mono text-[11px] text-gray-600">
            ${state.flashcardFlipped ? 'Clique para voltar à pergunta' : 'Clique para revelar a resposta'}
          </div>
        </div>

        <div class="flex flex-wrap items-center justify-between gap-2">
          <div class="flex gap-2">
            <button onclick="prevFlashcard()" class="px-3 py-2 bg-retroWin border-2 border-black font-mono text-xs font-bold shadow-retroSm hover:bg-white">
              ← Anterior
            </button>
            <button onclick="nextFlashcard()" class="px-3 py-2 bg-retroWin border-2 border-black font-mono text-xs font-bold shadow-retroSm hover:bg-white">
              Próximo →
            </button>
          </div>

          <button onclick="toggleMasteredCard('${card.id}')"
            class="px-3.5 py-2 border-2 border-black font-mono text-xs font-bold shadow-retroSm
            ${isMastered ? 'bg-gray-300 text-black' : 'bg-retroLime text-black hover:brightness-95'}">
            ${isMastered ? 'Desmarcar Dominado' : '✅ Marcar como Dominado'}
          </button>
        </div>
      </div>
    </div>
  `;
}

function setFlashcardFilter(filterId) {
  state.flashcardFilter = filterId;
  state.flashcardIndex = 0;
  state.flashcardFlipped = false;
  renderCurrentView();
}

function toggleFlipFlashcard() {
  state.flashcardFlipped = !state.flashcardFlipped;
  renderCurrentView();
}

function prevFlashcard() {
  const cards = getFilteredFlashcards();
  state.flashcardIndex = (state.flashcardIndex - 1 + cards.length) % cards.length;
  state.flashcardFlipped = false;
  renderCurrentView();
}

function nextFlashcard() {
  const cards = getFilteredFlashcards();
  state.flashcardIndex = (state.flashcardIndex + 1) % cards.length;
  state.flashcardFlipped = false;
  renderCurrentView();
}

function toggleMasteredCard(cardId) {
  if (state.masteredCards.includes(cardId)) {
    state.masteredCards = state.masteredCards.filter(id => id !== cardId);
  } else {
    state.masteredCards.push(cardId);
  }
  localStorage.setItem('bioos_mastered_cards', JSON.stringify(state.masteredCards));
  renderCurrentView();
}

/* =========================================================
   MÓDULO 1: BIOLOGIA CELULAR + ESCALA CONTÍNUA EM TEMPO REAL
   ========================================================= */
function renderCelularView(container) {
  const cellInfo = state.celularData.tiposCelula[state.cellType];

  container.innerHTML = `
    <div class="space-y-6">
      <div class="bg-retroTeal text-white p-4 border-2 border-black shadow-retro flex flex-wrap justify-between items-center gap-3">
        <div>
          <h2 class="font-pixel text-xs sm:text-sm md:text-base">🔬 LABORATÓRIO DE BIOLOGIA CELULAR</h2>
          <p class="font-mono text-xs mt-1 text-black font-bold">Modelos celulares interativos, jornal científico e escala real</p>
        </div>
        <div class="flex flex-wrap gap-1.5">
          ${['animal', 'vegetal', 'procarionte'].map(tipo => `
            <button onclick="changeCellType('${tipo}')"
              class="px-3 py-1.5 font-mono text-xs font-bold border-2 border-black uppercase
              ${state.cellType === tipo ? 'bg-retroAmber text-black shadow-retroSm' : 'bg-retroWin text-black hover:bg-white'}">
              ${tipo === 'animal' ? '🐾 Animal' : tipo === 'vegetal' ? '🌱 Vegetal' : '🦠 Bactéria'}
            </button>
          `).join('')}
        </div>
      </div>

      <div class="grid grid-cols-1 xl:grid-cols-12 gap-4">
        <div class="xl:col-span-7 bg-white border-2 border-black p-4 shadow-retro flex flex-col justify-between">
          <div class="flex justify-between items-center border-b-2 border-black pb-2 mb-3">
            <span class="font-pixel text-[10px] sm:text-[11px] text-retroBlue">${cellInfo.nome}</span>
            <span class="font-mono text-[11px] bg-retroAmber px-2 py-0.5 border border-black">Clique nas organelas</span>
          </div>

          <div class="flex justify-center items-center my-2">
            ${getCellSVG(state.cellType, state.selectedOrganelle?.id)}
          </div>

          <p class="font-sans text-xs text-gray-800 bg-retroPaper p-2.5 border border-black mt-2 leading-relaxed">
            ${cellInfo.descricao}
          </p>
        </div>

        <div class="xl:col-span-5 bg-retroWin border-2 border-black p-4 shadow-retro flex flex-col justify-between">
          <div>
            <div class="bg-black text-retroLime font-pixel text-[10px] px-2 py-1.5 mb-3">
              SCANNER DE ORGANELA // DADOS
            </div>

            <div class="flex flex-wrap gap-1 mb-4">
              ${cellInfo.organelas.map(org => `
                <button onclick="selectOrganelle('${org.id}')"
                  class="px-2 py-1 text-[11px] font-mono font-bold border border-black
                  ${state.selectedOrganelle?.id === org.id ? 'bg-retroCoral text-white' : 'bg-white text-black hover:bg-retroAmber'}">
                  ${org.nome.split(' ')[0]}
                </button>
              `).join('')}
            </div>

            ${state.selectedOrganelle ? `
              <div class="bg-retroPaper border-2 border-black p-3.5 space-y-2.5 shadow-winInset">
                <h3 class="font-pixel text-xs text-retroBlue">${state.selectedOrganelle.nome}</h3>
                <div class="inline-block bg-retroAmber font-mono text-xs font-bold px-2 py-0.5 border border-black">
                  ${state.selectedOrganelle.analogia}
                </div>
                <p class="text-sm leading-relaxed"><strong>Função:</strong> ${state.selectedOrganelle.funcao}</p>
                <div class="bg-blue-50 border-l-4 border-retroBlue p-2 text-xs leading-relaxed">
                  <strong>💡 Curiosidade:</strong> ${state.selectedOrganelle.curiosidade}
                </div>
                <p class="font-mono text-[11px] text-gray-600 pt-1 border-t border-gray-400">
                  📚 Ref: ${state.selectedOrganelle.referencia}
                </p>
              </div>
            ` : ''}
          </div>
        </div>
      </div>

      ${renderJournalColumnBlock('GAZETA CELULAR — COLUNA DE APROFUNDAMENTO', CELL_JOURNAL_ARTICLES)}

      <div class="bg-white border-2 border-black p-4 shadow-retro space-y-4">
        <div class="flex flex-wrap justify-between items-center gap-2 border-b-2 border-black pb-2">
          <div>
            <h3 class="font-pixel text-[10px] sm:text-xs text-retroBlue">📏 ESCALA REAL CONTÍNUA (FIO DE CABELO → INTERIOR DA CÉLULA → DNA)</h3>
            <p class="font-mono text-[11px] text-gray-600 mt-0.5">Arraste o controle ou use os botões para ver o tamanho relativo real mudando ao vivo</p>
          </div>
          <span id="live-scale-instrument" class="font-mono text-xs font-bold bg-black text-retroLime px-2.5 py-1">--</span>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
          <div id="live-scale-stage"
            class="lg:col-span-7 bg-[#0d1b2a] border-2 border-black h-72 sm:h-80 relative overflow-hidden flex items-center justify-center p-4">
            <div class="absolute inset-0 opacity-20"
              style="background-image: linear-gradient(to right, #4ea8de 1px, transparent 1px), linear-gradient(to bottom, #4ea8de 1px, transparent 1px); background-size: 24px 24px;">
            </div>
            <div id="live-scale-canvas" class="relative z-10 w-full h-full flex items-center justify-center"></div>
            <div id="live-scale-ruler"
              class="absolute bottom-2.5 left-2.5 right-2.5 z-20 flex flex-wrap justify-between items-center bg-black/80 text-white font-mono text-[11px] px-2.5 py-1.5 border border-retroLime">
              <span id="ruler-fov">Campo de visão: --</span>
              <span id="ruler-focus" class="text-retroAmber font-bold">--</span>
            </div>
          </div>

          <div class="lg:col-span-5 space-y-3 bg-retroPaper border-2 border-black p-3.5">
            <div class="flex justify-between font-mono text-[11px] font-bold">
              <span>🔍 Menor Zoom (Fio de Cabelo)</span>
              <span>🔬 Maior Zoom (Nano)</span>
            </div>

            <input id="live-scale-slider" type="range" min="0" max="100" step="0.5" value="${state.scaleZoom}"
              oninput="handleLiveScale(this.value)" class="w-full retro-slider" />

            <div class="flex flex-wrap gap-1.5">
              <button onclick="setScalePreset(10)" class="px-2 py-1 font-mono text-[11px] font-bold border border-black bg-retroAmber hover:bg-yellow-300">💇 Fio de Cabelo (~70 µm)</button>
              <button onclick="setScalePreset(38)" class="px-2 py-1 font-mono text-[11px] font-bold border border-black bg-retroTeal text-white hover:opacity-90">🧬 Entrar na Célula (~25 µm)</button>
              <button onclick="setScalePreset(65)" class="px-2 py-1 font-mono text-[11px] font-bold border border-black bg-retroCoral text-white hover:opacity-90">🦠 Bactéria (~2 µm)</button>
              <button onclick="setScalePreset(95)" class="px-2 py-1 font-mono text-[11px] font-bold border border-black bg-retroBlue text-white hover:opacity-90">⚛️ DNA / Nano (~2,5 nm)</button>
            </div>

            <p id="live-scale-desc" class="text-xs sm:text-sm leading-relaxed text-gray-800 bg-white p-2.5 border border-black">--</p>
          </div>
        </div>
      </div>

      ${renderQuizBox('celular', {
        pergunta: 'Se um fio de cabelo tem ~70 µm e uma bactéria E. coli tem ~2 µm, qual afirmação descreve corretamente a escala relativa?',
        opcoes: [
          'A bactéria é maior que a espessura de um fio de cabelo',
          'O fio de cabelo é cerca de 35 vezes mais espesso que o comprimento da bactéria',
          'Ambos têm o mesmo tamanho na escala de nanômetros',
          'Uma bactéria é visível a olho nu sem microscópio'
        ],
        correta: 1,
        explicacao: '70 µm ÷ 2 µm = 35 vezes. Por isso o fio de cabelo parece gigantesco quando entramos na escala microscópica e celular.'
      })}
    </div>
  `;

  updateLiveScaleVisuals(state.scaleZoom);
}

function handleLiveScale(val) {
  state.scaleZoom = Number(val);
  updateLiveScaleVisuals(state.scaleZoom);
}

function setScalePreset(val) {
  state.scaleZoom = Number(val);
  const slider = document.getElementById('live-scale-slider');
  if (slider) slider.value = state.scaleZoom;
  updateLiveScaleVisuals(state.scaleZoom);
}

function updateLiveScaleVisuals(zoomVal) {
  const fovUm = 250 * Math.pow(0.02 / 250, zoomVal / 100);
  const stageWidthPx = 420;
  const pxPerUm = stageWidthPx / fovUm;

  const hairPx = Math.min(Math.max(70 * pxPerUm, 2), 900);
  const cellPx = Math.min(Math.max(25 * pxPerUm, 4), 760);
  const bacPx = Math.min(Math.max(2 * pxPerUm, 3), 520);
  const dnaPx = Math.min(Math.max(0.0025 * pxPerUm, 2), 260);

  const canvas = document.getElementById('live-scale-canvas');
  if (!canvas) return;

  canvas.innerHTML = `
    <div title="Fio de cabelo (~70 µm)"
      style="width: ${hairPx}px; height: ${Math.min(hairPx * 3, 340)}px;"
      class="absolute bg-gradient-to-r from-amber-500 via-yellow-300 to-amber-600 opacity-85 border border-black/50 flex items-center justify-center pointer-events-none">
      ${hairPx > 32 ? `<span class="bg-black/75 text-yellow-200 font-mono text-[10px] px-1.5 py-0.5 -rotate-90 whitespace-nowrap">💇 Fio de Cabelo (70 µm)</span>` : ''}
    </div>

    <div title="Célula Eucariótica (~25 µm)"
      style="width: ${cellPx}px; height: ${cellPx * 0.78}px;"
      class="relative rounded-full bg-teal-400/35 border-2 border-retroLime flex items-center justify-center pointer-events-none">
      ${cellPx > 65 ? `
        <span class="absolute top-1.5 font-mono text-[10px] bg-black/80 text-retroLime px-1.5 py-0.5">🧬 Célula (~25 µm)</span>
        <div style="width: ${cellPx * 0.34}px; height: ${cellPx * 0.34}px;"
          class="rounded-full bg-purple-600/80 border border-white flex items-center justify-center">
          ${cellPx > 140 ? `<span class="text-[9px] font-mono text-white">Núcleo</span>` : ''}
        </div>
        <div style="width: ${cellPx * 0.22}px; height: ${cellPx * 0.11}px;"
          class="absolute bottom-4 right-5 rounded-full bg-orange-500/90 border border-black">
        </div>
      ` : ''}
    </div>

    <div title="Bactéria (~2 µm)"
      style="width: ${bacPx}px; height: ${Math.max(bacPx * 0.45, 3)}px;"
      class="absolute rounded-full bg-orange-500 border border-white flex items-center justify-center pointer-events-none">
      ${bacPx > 45 ? `<span class="font-mono text-[9px] text-black font-bold bg-white/80 px-1 rounded">🦠 Bactéria (2 µm)</span>` : ''}
    </div>

    <div title="DNA (~2,5 nm)"
      style="width: ${dnaPx}px; height: ${dnaPx}px;"
      class="absolute rounded-full bg-blue-400 border border-white pointer-events-none">
    </div>
  `;

  let refObj = SCALE_REFERENCE_OBJECTS[0];
  if (zoomVal >= 82) refObj = SCALE_REFERENCE_OBJECTS[4];
  else if (zoomVal >= 60) refObj = SCALE_REFERENCE_OBJECTS[3];
  else if (zoomVal >= 42) refObj = SCALE_REFERENCE_OBJECTS[2];
  else if (zoomVal >= 22) refObj = SCALE_REFERENCE_OBJECTS[1];

  const fovLabel = fovUm >= 1 ? `${fovUm.toFixed(1)} µm` : `${(fovUm * 1000).toFixed(1)} nm`;

  document.getElementById('ruler-fov').textContent = `Campo de visão: ${fovLabel}`;
  document.getElementById('ruler-focus').textContent = `Foco: ${refObj.nome}`;
  document.getElementById('live-scale-instrument').textContent = `🔭 ${refObj.instrumento}`;
  document.getElementById('live-scale-desc').innerHTML = `<strong class="text-retroBlue">${refObj.nome}:</strong> ${refObj.desc}`;
}

function changeCellType(tipo) {
  state.cellType = tipo;
  state.selectedOrganelle = state.celularData.tiposCelula[tipo].organelas[0];
  renderCurrentView();
}

function selectOrganelle(orgId) {
  const list = state.celularData.tiposCelula[state.cellType].organelas;
  state.selectedOrganelle = list.find(o => o.id === orgId);
  renderCurrentView();
}

function getCellSVG(tipo, activeId) {
  const cls = (id) => `organelle ${activeId === id ? 'active' : ''}`;
  if (tipo === 'animal') {
    return `
      <svg viewBox="0 0 420 280" class="w-full max-w-md h-auto">
        <ellipse cx="210" cy="140" rx="195" ry="125" fill="#FFE8D6" stroke="#000" stroke-width="4" class="${cls('membrana')}" onclick="selectOrganelle('membrana')" />
        <g class="${cls('nucleo')}" onclick="selectOrganelle('nucleo')">
          <circle cx="195" cy="135" r="46" fill="#8338EC" stroke="#000" stroke-width="2.5" />
          <circle cx="195" cy="135" r="16" fill="#3A0CA3" />
          <text x="195" y="139" text-anchor="middle" fill="#fff" font-size="10" font-family="monospace">Núcleo</text>
        </g>
        <path d="M135 110 Q115 140 135 170 Q150 185 165 175" fill="none" stroke="#3A86FF" stroke-width="8" stroke-linecap="round" class="${cls('reticulo')}" onclick="selectOrganelle('reticulo')" />
        <g class="${cls('mitocondria')}" onclick="selectOrganelle('mitocondria')">
          <ellipse cx="310" cy="95" rx="32" ry="16" transform="rotate(-20 310 95)" fill="#FB5607" stroke="#000" stroke-width="2" />
          <path d="M288 98 L302 90 L312 100 L328 88" fill="none" stroke="#FFB703" stroke-width="2.5" />
        </g>
        <g class="${cls('golgi')}" onclick="selectOrganelle('golgi')">
          <path d="M265 175 Q295 165 325 175" fill="none" stroke="#00A896" stroke-width="6" stroke-linecap="round" />
          <path d="M270 187 Q295 177 320 187" fill="none" stroke="#00A896" stroke-width="6" stroke-linecap="round" />
          <path d="M275 199 Q295 189 315 199" fill="none" stroke="#00A896" stroke-width="6" stroke-linecap="round" />
        </g>
        <g class="${cls('lisossomo')}" onclick="selectOrganelle('lisossomo')">
          <circle cx="110" cy="205" r="16" fill="#8AC926" stroke="#000" stroke-width="2" />
          <circle cx="105" cy="201" r="2.5" fill="#000" />
          <circle cx="115" cy="208" r="2.5" fill="#000" />
        </g>
      </svg>
    `;
  }
  if (tipo === 'vegetal') {
    return `
      <svg viewBox="0 0 420 280" class="w-full max-w-md h-auto">
        <polygon points="40,30 380,30 400,140 380,250 40,250 20,140" fill="#52B788" stroke="#000" stroke-width="5" class="${cls('parede')}" onclick="selectOrganelle('parede')" />
        <polygon points="52,42 368,42 385,140 368,238 52,238 35,140" fill="#D8F3DC" stroke="#000" stroke-width="2" />
        <g class="${cls('vacuolo')}" onclick="selectOrganelle('vacuolo')">
          <ellipse cx="235" cy="145" rx="95" ry="65" fill="#90E0EF" stroke="#0077B6" stroke-width="2.5" />
          <text x="235" y="149" text-anchor="middle" fill="#023E8A" font-size="11" font-family="monospace" font-weight="bold">Vacúolo Central</text>
        </g>
        <g class="${cls('nucleo_veg')}" onclick="selectOrganelle('nucleo_veg')">
          <circle cx="95" cy="105" r="32" fill="#8338EC" stroke="#000" stroke-width="2" />
          <text x="95" y="109" text-anchor="middle" fill="#fff" font-size="9" font-family="monospace">Núcleo</text>
        </g>
        <g class="${cls('cloroplasto')}" onclick="selectOrganelle('cloroplasto')">
          <ellipse cx="105" cy="195" rx="28" ry="14" fill="#2D6A4F" stroke="#000" stroke-width="2" />
          <ellipse cx="335" cy="75" rx="28" ry="14" fill="#2D6A4F" stroke="#000" stroke-width="2" />
          <ellipse cx="330" cy="210" rx="28" ry="14" fill="#2D6A4F" stroke="#000" stroke-width="2" />
        </g>
      </svg>
    `;
  }
  return `
    <svg viewBox="0 0 420 280" class="w-full max-w-md h-auto">
      <path d="M350 140 Q375 110 390 140 T415 140" fill="none" stroke="#FB5607" stroke-width="5" stroke-linecap="round" class="${cls('flagelo')}" onclick="selectOrganelle('flagelo')" />
      <rect x="60" y="75" width="290" height="130" rx="65" fill="#B5E48C" stroke="#000" stroke-width="4" />
      <rect x="72" y="87" width="266" height="106" rx="53" fill="#FFF3B0" stroke="#000" stroke-width="2" />
      <g class="${cls('nucleoide')}" onclick="selectOrganelle('nucleoide')">
        <path d="M140 130 C160 100, 210 170, 230 125 C245 100, 190 175, 155 150 Z" fill="none" stroke="#8338EC" stroke-width="5" />
        <text x="185" y="112" text-anchor="middle" fill="#3A0CA3" font-size="10" font-family="monospace" font-weight="bold">Nucleoide</text>
      </g>
      <g class="${cls('plasmideo')}" onclick="selectOrganelle('plasmideo')">
        <circle cx="285" cy="140" r="18" fill="none" stroke="#E63946" stroke-width="4" />
        <text x="285" y="170" text-anchor="middle" fill="#E63946" font-size="9" font-family="monospace" font-weight="bold">Plasmídeo</text>
      </g>
      <g class="${cls('ribossomo_prok')}" onclick="selectOrganelle('ribossomo_prok')">
        <circle cx="110" cy="120" r="5" fill="#000" />
        <circle cx="115" cy="155" r="5" fill="#000" />
        <circle cx="245" cy="115" r="5" fill="#000" />
        <circle cx="235" cy="168" r="5" fill="#000" />
      </g>
    </svg>
  `;
}

/* =========================================================
   MÓDULO 2: DISCIPLINAS, SUBMATÉRIAS, JORNAL E QUIZZES
   ========================================================= */
function renderDisciplinaView(container, discKey) {
  const data = state.disciplinasData.disciplinas[discKey];
  const quizSelecionado = data.quizzes[Math.floor(Math.random() * data.quizzes.length)];
  const artigosDisciplina = DISCIPLINE_JOURNAL_ARTICLES[discKey] || [];

  let simulatorHTML = '';
  if (discKey === 'anatomia') simulatorHTML = renderHeartSimulator();
  else if (discKey === 'evolucao') simulatorHTML = renderCladogramSimulator();

  container.innerHTML = `
    <div class="space-y-6">
      <div style="background-color: ${data.cor};" class="p-4 border-2 border-black shadow-retro text-white">
        <div class="flex items-center gap-3">
          <span class="text-3xl bg-white p-1.5 border-2 border-black shrink-0">${data.icone}</span>
          <div>
            <h2 class="font-pixel text-xs sm:text-sm md:text-base drop-shadow-[2px_2px_0px_#000]">${data.titulo}</h2>
            <p class="font-mono text-xs mt-1 bg-black/80 text-white px-2 py-0.5 inline-block">${data.subtitulo}</p>
          </div>
        </div>
      </div>

      ${data.submaterias ? `
        <div class="bg-retroWin border-2 border-black p-4 shadow-retro">
          <div class="font-pixel text-[10px] bg-black text-retroLime px-2.5 py-1.5 mb-3">
            📂 SUBMATÉRIAS APROFUNDADAS (${data.submaterias.length} TELAS DEDICADAS)
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
            ${data.submaterias.map(sub => `
              <button onclick="openSubmatter('${sub.id}')"
                class="text-left bg-retroPaper hover:bg-yellow-50 p-3.5 border-2 border-black shadow-retroSm flex flex-col justify-between gap-2 transition-transform active:translate-y-0.5">
                <div>
                  <span class="font-mono text-[10px] bg-retroAmber px-1.5 py-0.5 border border-black font-bold">TELA DEDICADA ↗</span>
                  <h4 class="font-bold text-sm text-retroBlue mt-1.5">${sub.nome}</h4>
                </div>
                <span class="font-mono text-[11px] text-gray-700 underline">Abrir explicação detalhada →</span>
              </button>
            `).join('')}
          </div>
        </div>
      ` : ''}

      ${simulatorHTML}

      ${renderJournalColumnBlock(`GAZETA DE ${data.titulo.toUpperCase()}`, artigosDisciplina)}

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        ${data.topicos.map((topico, idx) => `
          <article class="bg-white border-2 border-black p-4 shadow-retro flex flex-col justify-between space-y-3">
            <div>
              <span class="font-pixel text-[10px] bg-retroAmber px-2 py-0.5 border border-black inline-block mb-2">FICHA #0${idx + 1}</span>
              <h3 class="font-bold text-base text-retroBlue mb-2">${topico.titulo}</h3>
              <p class="text-sm leading-relaxed text-gray-800">${topico.resumo}</p>
            </div>

            <div class="space-y-2 pt-2">
              <div class="bg-retroPaper border-l-4 border-retroCoral p-2.5 text-xs leading-relaxed">
                <strong>🔬 Ponto-Chave:</strong> ${topico.destaque}
              </div>
              <p class="font-mono text-[11px] text-gray-600 border-t border-gray-300 pt-1.5">
                📚 ${topico.referencia}
              </p>
            </div>
          </article>
        `).join('')}
      </div>

      ${renderQuizBox(discKey, quizSelecionado)}
    </div>
  `;
}

function renderSubmatterScreen(container, discKey, submatterId) {
  const disc = state.disciplinasData.disciplinas[discKey];
  const sub = disc.submaterias.find(s => s.id === submatterId);
  const quizSelecionado = disc.quizzes[Math.floor(Math.random() * disc.quizzes.length)];

  container.innerHTML = `
    <div class="space-y-5">
      <div class="flex flex-wrap items-center justify-between gap-2 bg-retroWin border-2 border-black p-3 shadow-retroSm">
        <button onclick="closeSubmatter()"
          class="px-3 py-1.5 bg-retroBlue text-white font-mono text-xs font-bold border-2 border-black shadow-retroSm hover:bg-blue-900">
          ← Voltar para ${disc.titulo}
        </button>
        <span class="font-mono text-xs font-bold">Módulo: ${disc.titulo} / Submatéria</span>
      </div>

      <article class="bg-white border-2 border-black p-5 shadow-retro space-y-4">
        <div class="border-b-2 border-black pb-3">
          <span class="font-pixel text-[10px] bg-retroLime px-2 py-0.5 border border-black">ESTUDO APROFUNDADO</span>
          <h2 class="font-pixel text-sm sm:text-base text-retroBlue mt-2 leading-relaxed">${sub.nome}</h2>
        </div>

        <div class="space-y-2">
          <h3 class="font-bold text-sm uppercase font-mono text-gray-700">1. Visão Geral e Estrutura</h3>
          <p class="text-sm sm:text-base leading-relaxed text-gray-800">${sub.resumoDetalhado || sub.resumo}</p>
        </div>

        ${sub.mecanismo ? `
          <div class="bg-retroPaper border-2 border-black p-4 space-y-1.5">
            <h3 class="font-bold text-sm font-mono text-retroBlue">2. Mecanismo Fisiológico / Processo</h3>
            <p class="text-sm leading-relaxed text-gray-800">${sub.mecanismo}</p>
          </div>
        ` : ''}

        ${sub.exemploClinico ? `
          <div class="bg-amber-50 border-l-4 border-retroCoral p-3.5 space-y-1">
            <h3 class="font-bold text-xs font-mono uppercase text-retroCoral">3. Aplicação Prática / Relevância Biológica</h3>
            <p class="text-sm leading-relaxed text-gray-800">${sub.exemploClinico}</p>
          </div>
        ` : ''}

        <p class="font-mono text-xs text-gray-600 pt-2 border-t border-gray-300">
          📚 Referência: ${sub.referencia}
        </p>
      </article>

      ${renderQuizBox(`${discKey}_${submatterId}`, quizSelecionado)}
    </div>
  `;
}

function renderHeartSimulator() {
  const info = HEART_DATA[state.selectedHeartPart];
  const cls = (id) => `organelle ${state.selectedHeartPart === id ? 'active' : ''}`;

  return `
    <div class="bg-white border-2 border-black p-4 shadow-retro">
      <div class="flex flex-wrap justify-between items-center border-b-2 border-black pb-2 mb-4 gap-2">
        <h3 class="font-pixel text-[10px] sm:text-xs text-retroBlue">🫀 SIMULADOR DE CIRCULAÇÃO CARDIOVASCULAR</h3>
        <span class="font-mono text-[11px] bg-retroAmber px-2 py-0.5 border border-black">Clique nas câmaras ou pulmões</span>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
        <div class="lg:col-span-6 bg-retroPaper border-2 border-black p-3 flex justify-center">
          <svg viewBox="0 0 380 260" class="w-full max-w-sm h-auto">
            <g class="${cls('pulmoes')}" onclick="selectHeartPart('pulmoes')">
              <rect x="115" y="12" width="150" height="44" rx="10" fill="#D8B4E2" stroke="#000" stroke-width="2.5" />
              <text x="190" y="32" text-anchor="middle" font-family="monospace" font-size="11" font-weight="bold">🫁 PULMÕES</text>
              <text x="190" y="46" text-anchor="middle" font-family="monospace" font-size="9">(Hematose: CO₂ ↔ O₂)</text>
            </g>
            <path d="M125 95 L125 58" stroke="#1D4ED8" stroke-width="4" />
            <path d="M255 58 L255 95" stroke="#DC2626" stroke-width="4" />
            <g class="${cls('ad')}" onclick="selectHeartPart('ad')">
              <rect x="75" y="95" width="105" height="55" fill="#60A5FA" stroke="#000" stroke-width="2.5" />
              <text x="127" y="120" text-anchor="middle" font-family="monospace" font-size="11" font-weight="bold">Átrio Dir.</text>
              <text x="127" y="135" text-anchor="middle" font-family="monospace" font-size="9">(Veias Cavas)</text>
            </g>
            <g class="${cls('vd')}" onclick="selectHeartPart('vd')">
              <polygon points="75,152 180,152 180,235 105,235" fill="#2563EB" stroke="#000" stroke-width="2.5" />
              <text x="132" y="190" text-anchor="middle" fill="#fff" font-family="monospace" font-size="11" font-weight="bold">Ventr. Dir.</text>
              <text x="132" y="205" text-anchor="middle" fill="#DBEAFE" font-family="monospace" font-size="9">(Art. Pulmonar)</text>
            </g>
            <g class="${cls('ae')}" onclick="selectHeartPart('ae')">
              <rect x="195" y="95" width="105" height="55" fill="#F87171" stroke="#000" stroke-width="2.5" />
              <text x="247" y="120" text-anchor="middle" font-family="monospace" font-size="11" font-weight="bold">Átrio Esq.</text>
              <text x="247" y="135" text-anchor="middle" font-family="monospace" font-size="9">(V. Pulmonares)</text>
            </g>
            <g class="${cls('ve')}" onclick="selectHeartPart('ve')">
              <polygon points="195,152 300,152 270,235 195,235" fill="#DC2626" stroke="#000" stroke-width="2.5" />
              <text x="242" y="190" text-anchor="middle" fill="#fff" font-family="monospace" font-size="11" font-weight="bold">Ventr. Esq.</text>
              <text x="242" y="205" text-anchor="middle" fill="#FEE2E2" font-family="monospace" font-size="9">(Art. Aorta)</text>
            </g>
            <text x="190" y="254" text-anchor="middle" font-family="monospace" font-size="9" fill="#333">
              Azul: Sangue Venoso (CO₂) | Vermelho: Sangue Arterial (O₂)
            </text>
          </svg>
        </div>

        <div class="lg:col-span-6 bg-retroWin border-2 border-black p-3.5 space-y-2.5 shadow-winInset">
          <div class="flex flex-wrap gap-1 mb-2">
            ${Object.keys(HEART_DATA).map(key => `
              <button onclick="selectHeartPart('${key}')"
                class="px-2 py-1 font-mono text-[11px] font-bold border border-black
                ${state.selectedHeartPart === key ? 'bg-black text-retroLime' : 'bg-white hover:bg-retroAmber'}">
                ${key.toUpperCase()}
              </button>
            `).join('')}
          </div>

          <div class="bg-retroPaper border-2 border-black p-3 space-y-2">
            <h4 class="font-pixel text-xs text-retroBlue">${info.nome}</h4>
            <span class="inline-block px-2 py-0.5 font-mono text-xs font-bold border border-black ${info.corBadge}">
              ${info.tipoSangue}
            </span>
            <p class="text-sm leading-relaxed"><strong>Dinâmica do Fluxo:</strong> ${info.trajeto}</p>
            <p class="font-mono text-xs bg-white p-1.5 border border-black">
              <strong>Pressão Fisiológica:</strong> ${info.pressao}
            </p>
            <p class="font-mono text-[10px] text-gray-600">📚 Ref: ${info.ref}</p>
          </div>
        </div>
      </div>
    </div>
  `;
}

function selectHeartPart(partId) {
  state.selectedHeartPart = partId;
  renderCurrentView();
}

function renderCladogramSimulator() {
  const node = CLADOGRAM_DATA[state.selectedCladeNode];
  const nodeCls = (id) => `cursor-pointer transition-transform ${state.selectedCladeNode === id ? 'scale-125' : ''}`;

  return `
    <div class="bg-white border-2 border-black p-4 shadow-retro">
      <div class="flex flex-wrap justify-between items-center border-b-2 border-black pb-2 mb-4 gap-2">
        <h3 class="font-pixel text-[10px] sm:text-xs text-retroBlue">🌳 CLADOGRAMA INTERATIVO DOS VERTEBRADOS</h3>
        <span class="font-mono text-[11px] bg-retroLime px-2 py-0.5 border border-black">Clique nos nós evolutivos</span>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
        <div class="lg:col-span-6 bg-retroPaper border-2 border-black p-3">
          <svg viewBox="0 0 380 230" class="w-full h-auto">
            <line x1="30" y1="200" x2="320" y2="30" stroke="#000" stroke-width="4" />
            <line x1="80" y1="170" x2="80" y2="30" stroke="#000" stroke-width="3" />
            <text x="80" y="18" text-anchor="middle" font-family="monospace" font-size="11" font-weight="bold">🦈 Peixes</text>
            <line x1="150" y1="130" x2="150" y2="30" stroke="#000" stroke-width="3" />
            <text x="150" y="18" text-anchor="middle" font-family="monospace" font-size="11" font-weight="bold">🐸 Anfíbios</text>
            <line x1="225" y1="86" x2="225" y2="30" stroke="#000" stroke-width="3" />
            <text x="225" y="18" text-anchor="middle" font-family="monospace" font-size="11" font-weight="bold">🦎 Répteis/Aves</text>
            <text x="330" y="18" text-anchor="middle" font-family="monospace" font-size="11" font-weight="bold">🦍 Mamíferos</text>

            <g class="${nodeCls('gnathostomata')}" onclick="selectCladeNode('gnathostomata')">
              <circle cx="80" cy="170" r="10" fill="${state.selectedCladeNode === 'gnathostomata' ? '#FB5607' : '#FFB703'}" stroke="#000" stroke-width="2.5" />
              <text x="96" y="184" font-family="monospace" font-size="10" font-weight="bold">1. Mandíbulas</text>
            </g>
            <g class="${nodeCls('tetrapoda')}" onclick="selectCladeNode('tetrapoda')">
              <circle cx="150" cy="130" r="10" fill="${state.selectedCladeNode === 'tetrapoda' ? '#FB5607' : '#FFB703'}" stroke="#000" stroke-width="2.5" />
              <text x="166" y="144" font-family="monospace" font-size="10" font-weight="bold">2. Tetrápodes</text>
            </g>
            <g class="${nodeCls('amniota')}" onclick="selectCladeNode('amniota')">
              <circle cx="225" cy="86" r="10" fill="${state.selectedCladeNode === 'amniota' ? '#FB5607' : '#FFB703'}" stroke="#000" stroke-width="2.5" />
              <text x="241" y="100" font-family="monospace" font-size="10" font-weight="bold">3. Ovo Amniótico</text>
            </g>
            <g class="${nodeCls('mammalia')}" onclick="selectCladeNode('mammalia')">
              <circle cx="295" cy="45" r="10" fill="${state.selectedCladeNode === 'mammalia' ? '#FB5607' : '#FFB703'}" stroke="#000" stroke-width="2.5" />
              <text x="255" y="66" font-family="monospace" font-size="10" font-weight="bold">4. Pelos/Leite</text>
            </g>
          </svg>
        </div>

        <div class="lg:col-span-6 bg-retroWin border-2 border-black p-3.5 space-y-2.5 shadow-winInset">
          <div class="flex flex-wrap gap-1 mb-2">
            ${Object.keys(CLADOGRAM_DATA).map((key, i) => `
              <button onclick="selectCladeNode('${key}')"
                class="px-2 py-1 font-mono text-[11px] font-bold border border-black
                ${state.selectedCladeNode === key ? 'bg-retroBlue text-white' : 'bg-white hover:bg-retroAmber'}">
                Nó #${i + 1}
              </button>
            `).join('')}
          </div>

          <div class="bg-retroPaper border-2 border-black p-3 space-y-2">
            <h4 class="font-pixel text-xs text-retroBlue">${node.no}</h4>
            <div class="bg-retroAmber px-2 py-0.5 border border-black font-mono text-xs font-bold">
              Clado: ${node.grupoEmergente}
            </div>
            <p class="text-xs leading-relaxed"><strong>Sinapomorfia (Novidade):</strong> ${node.sinapomorfia}</p>
            <p class="text-xs leading-relaxed"><strong>Impacto Adaptativo:</strong> ${node.impacto}</p>
            <p class="font-mono text-[10px] text-gray-600">📚 Ref: ${node.ref}</p>
          </div>
        </div>
      </div>
    </div>
  `;
}

function selectCladeNode(nodeId) {
  state.selectedCladeNode = nodeId;
  renderCurrentView();
}

function renderQuizBox(quizId, quiz) {
  const baseDiscKey = quizId.split('_')[0];
  return `
    <div class="bg-retroWin border-2 border-black p-4 shadow-retro">
      <div class="bg-retroBlue text-white font-pixel text-[10px] px-2.5 py-1.5 mb-3 flex justify-between items-center">
        <span>🎮 DESAFIO DE FIXAÇÃO</span>
        <span>Valendo Medalha & Acertos!</span>
      </div>
      <p class="font-bold text-sm mb-3">${quiz.pergunta}</p>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-2" id="quiz-options-${quizId}">
        ${quiz.opcoes.map((opt, idx) => `
          <button onclick="checkAnswer('${quizId}', '${baseDiscKey}', ${idx}, ${quiz.correta}, '${quiz.explicacao.replace(/'/g, "\\'")}')"
            class="text-left p-2.5 bg-white hover:bg-retroAmber font-mono text-xs border-2 border-black shadow-retroSm transition-colors">
            <strong>${String.fromCharCode(65 + idx)})</strong> ${opt}
          </button>
        `).join('')}
      </div>
      <div id="quiz-feedback-${quizId}" class="mt-3 hidden p-3 border-2 border-black text-xs font-sans leading-relaxed"></div>
    </div>
  `;
}

function checkAnswer(quizId, badgeKey, selectedIdx, correctIdx, explicacao) {
  const feedback = document.getElementById(`quiz-feedback-${quizId}`);
  if (!feedback) return;
  feedback.classList.remove('hidden', 'bg-green-200', 'bg-red-200');

  if (selectedIdx === correctIdx) {
    feedback.classList.add('bg-green-200');
    feedback.innerHTML = `<strong>✅ Resposta Correta!</strong><br>${explicacao}`;
    unlockBadge(badgeKey);
    incrementCorrectCount();
  } else {
    feedback.classList.add('bg-red-200');
    feedback.innerHTML = `<strong>❌ Quase lá!</strong><br>${explicacao}`;
  }
}

/* =========================================================
   MÓDULO 3: APIS REAIS — REVISTAS CIENTÍFICAS & PRÊMIO NOBEL
   ========================================================= */
async function renderNoticiasNobelView(container) {
  container.innerHTML = `
    <div class="space-y-6">
      <div class="bg-retroBlue text-white p-4 border-2 border-black shadow-retro">
        <h2 class="font-pixel text-xs sm:text-sm md:text-base">📰 RADAR CIENTÍFICO & ARQUIVO PRÊMIO NOBEL</h2>
        <p class="font-mono text-xs mt-1 text-retroAmber">Conectado via APIs públicas (NobelPrize.org & Feeds Científicos)</p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <section class="bg-white border-2 border-black p-4 shadow-retro">
          <div class="flex justify-between items-center border-b-2 border-black pb-2 mb-3">
            <h3 class="font-pixel text-xs text-retroCoral">📡 MANCHETES DE CIÊNCIA</h3>
            <span class="font-mono text-[10px] bg-retroPaper px-2 py-0.5 border border-black">Agência FAPESP / Nature</span>
          </div>
          <div id="news-feed-list" class="space-y-3 font-sans text-xs">
            <p class="font-mono animate-pulse">Carregando manchetes científicas...</p>
          </div>
        </section>

        <section class="bg-white border-2 border-black p-4 shadow-retro">
          <div class="flex flex-wrap justify-between items-center gap-2 border-b-2 border-black pb-2 mb-3">
            <h3 class="font-pixel text-xs text-retroBlue">🏅 PRÊMIO NOBEL</h3>
            <div class="flex gap-1">
              <button onclick="loadNobel('med')" class="px-2 py-0.5 bg-retroAmber border border-black font-mono text-[11px] font-bold">Medicina</button>
              <button onclick="loadNobel('che')" class="px-2 py-0.5 bg-retroTeal text-white border border-black font-mono text-[11px] font-bold">Química</button>
            </div>
          </div>
          <div id="nobel-list" class="space-y-2.5 max-h-[450px] overflow-y-auto pr-1">
            <p class="font-mono text-xs animate-pulse">Consultando api.nobelprize.org...</p>
          </div>
        </section>
      </div>
    </div>
  `;

  loadScienceNews();
  loadNobel('med');
}

async function loadScienceNews() {
  const listEl = document.getElementById('news-feed-list');
  if (!listEl) return;
  const rssUrl = encodeURIComponent('https://agencia.fapesp.br/rss');

  try {
    const res = await fetch(`https://api.rss2json.com/v1/api.json?rss_url=${rssUrl}`);
    const data = await res.json();

    if (data.status === 'ok' && Array.isArray(data.items) && data.items.length > 0) {
      listEl.innerHTML = data.items.slice(0, 6).map(item => `
        <div class="bg-retroPaper p-3 border border-black hover:bg-yellow-50">
          <span class="font-mono text-[10px] text-gray-600">${new Date(item.pubDate).toLocaleDateString('pt-BR')}</span>
          <h4 class="font-bold text-sm mt-0.5">
            <a href="${item.link}" target="_blank" rel="noopener noreferrer" class="text-retroBlue hover:underline">${item.title} ↗</a>
          </h4>
        </div>
      `).join('');
      return;
    }
    throw new Error('Fallback');
  } catch (e) {
    listEl.innerHTML = `
      <div class="bg-retroPaper p-3 border border-black">
        <span class="font-mono text-[10px] bg-retroLime px-1.5 border border-black">Nature</span>
        <h4 class="font-bold text-sm mt-1">Mapeamento completo do conectoma neural revela novos circuitos sinápticos</h4>
      </div>
      <div class="bg-retroPaper p-3 border border-black">
        <span class="font-mono text-[10px] bg-retroAmber px-1.5 border border-black">Science</span>
        <h4 class="font-bold text-sm mt-1">Edição genética via CRISPR-Cas9 demonstra alta precisão na correção de mutações mitocondriais</h4>
      </div>
      <div class="bg-retroPaper p-3 border border-black">
        <span class="font-mono text-[10px] bg-retroTeal text-white px-1.5 border border-black">Agência FAPESP</span>
        <h4 class="font-bold text-sm mt-1">Pesquisadores identificam compostos bioativos na biodiversidade da Mata Atlântica</h4>
      </div>
    `;
  }
}

async function loadNobel(category) {
  const listEl = document.getElementById('nobel-list');
  if (!listEl) return;
  listEl.innerHTML = `<p class="font-mono text-xs animate-pulse">Buscando laureados na API oficial...</p>`;

  try {
    const res = await fetch(`https://api.nobelprize.org/2.1/nobelPrizes?nobelPrizeCategory=${category}&limit=8&sort=desc`);
    const data = await res.json();

    listEl.innerHTML = data.nobelPrizes.map(prize => {
      const laureados = prize.laureates
        ? prize.laureates.map(l => l.knownName?.en || l.orgName?.en).filter(Boolean).join(', ')
        : 'Não atribuído';
      const motivacao = prize.laureates?.[0]?.motivation?.en || 'Contribuições fundamentais para a ciência.';

      return `
        <div class="bg-retroPaper p-3 border border-black">
          <div class="flex justify-between items-center">
            <span class="font-pixel text-[10px] bg-retroBlue text-white px-2 py-0.5">ANO ${prize.awardYear}</span>
            <span class="font-mono text-[10px] uppercase font-bold">${category === 'med' ? 'Fisiologia/Medicina' : 'Química'}</span>
          </div>
          <h4 class="font-bold text-xs mt-1.5 text-black">${laureados}</h4>
          <p class="text-xs text-gray-700 mt-1 italic">"${motivacao}"</p>
        </div>
      `;
    }).join('');
  } catch (e) {
    listEl.innerHTML = `<p class="text-xs font-mono text-red-700">Não foi possível conectar à API do Prêmio Nobel no momento.</p>`;
  }
}

init();
