import { VoiceOption, PresetSpot, DarcoProduct } from '../types';

export const VOICES: VoiceOption[] = [
  {
    id: 'puck',
    name: 'Severino Silva (Puck)',
    voiceName: 'Puck',
    gender: 'Masc',
    tag: 'Voz Principal • Calorosa',
    description: 'Radialista acolhedor, tom alegre, entonação vibrante e sotaque marcante do sertão.',
  },
  {
    id: 'fenrir',
    name: 'Mestre Zé do Brejo (Fenrir)',
    voiceName: 'Fenrir',
    gender: 'Masc',
    tag: 'Voz Grave • Radialista AM',
    description: 'Voz encorpada, estilo locutor veterano de rádio regional, seguro e persuasivo.',
  },
  {
    id: 'kore',
    name: 'Dona Ciça (Kore)',
    voiceName: 'Kore',
    gender: 'Fem',
    tag: 'Voz Acolhedora • Afetuosa',
    description: 'Tom acolhedor de mãe e conselheira da terra, dicção cristalina e simpatia nordestina.',
  },
  {
    id: 'zephyr',
    name: 'Chico Violeiro (Zephyr)',
    voiceName: 'Zephyr',
    gender: 'Masc',
    tag: 'Voz Suave • Cadenciada',
    description: 'Ritmo compassado, ideal para poemas de cordel, reflexões sobre a terra e manhãs tranquilas.',
  },
  {
    id: 'charon',
    name: 'Coronel Tião (Charon)',
    voiceName: 'Charon',
    gender: 'Masc',
    tag: 'Voz Tradicional • Firme',
    description: 'Dicção clássica, autoridade respeitada, estilo testemunhal firme e confiável.',
  },
];

export const STYLE_PRESETS = [
  {
    id: 'padrao',
    label: 'Radialista Nordestino Raiz',
    prompt:
      'Locutor de rádio do Nordeste brasileiro, entonação calorosa, ritmo cadenciado, sotaque acolhedor e dicção impecável.',
  },
  {
    id: 'vibrante',
    label: 'Chamada Vibrante de Rádio FM',
    prompt:
      'Locutor comercial empolgado e entusiasmado, energia contagiante, ritmo dinâmico típico de rádio popular nordestina.',
  },
  {
    id: 'cordel',
    label: 'Poeta de Cordel & Violeiro',
    prompt:
      'Declamação ritmada em tom de repente e literatura de cordel, respeitando a cadência poética nordestina.',
  },
  {
    id: 'conselho',
    label: 'Prosa Acolhedora de Alpendre',
    prompt:
      'Conversa mansa e amiga de fim de tarde, voz afetuosa, falando de coração para coração com o ouvinte.',
  },
  {
    id: 'feira',
    label: 'Voz Popular de Feira Livre',
    prompt:
      'Voz carismática de pregoeiro tradicional de feira de Caruaru e Campina Grande, vivo, simpático e popular.',
  },
];

export const REGIONAL_EXPRESSIONS = [
  { label: 'Oxente!', insert: 'Oxente meu povo! ' },
  { label: 'Vixe Maria!', insert: 'Vixe Maria, olhe praí! ' },
  { label: 'Meu compadre', insert: 'Meu compadre e minha comadre, ' },
  { label: 'É arretado!', insert: 'É bom que só a gota, arretado demais! ' },
  { label: 'Da pura terra', insert: 'Tirado da pura terra do nosso sertão, ' },
  { label: 'Slogan Oficial', insert: "D'ARCO, DEIXE A NATUREZA CUIDAR DE VOCÊ!" },
];

export const PRESET_SPOTS: PresetSpot[] = [
  {
    id: 'spot-oficial',
    title: "Spot Oficial: D'ARCO e a Força da Natureza",
    category: 'Institucional',
    durationEst: '25 seg',
    suggestedVoice: 'Puck',
    styleModifier: 'Radialista caloroso de FM com muita energia e sorriso na voz',
    description: 'Apresentação emblemática da marca com o lema que conquista o ouvinte.',
    script:
      "Oxente meu povo! Cansado da correria do dia a dia? Venha cá, deixe o aperreio de lado e escute o que eu tô lhe dizendo: a força verdadeira tá na terra, na casca sagrada e nas ervas puras do nosso sertão! Produtos selecionados com todo o carinho pra sua saúde florescer. D'ARCO, DEIXE A NATUREZA CUIDAR DE VOCÊ!",
  },
  {
    id: 'spot-manha',
    title: 'Manhã Saudável no Sertão',
    category: 'Sertanejo',
    durationEst: '20 seg',
    suggestedVoice: 'Zephyr',
    styleModifier: 'Locução matinal tranquila, acolhedora e inspiradora',
    description: 'Despertar com disposição, chá quente e serenidade para o dia.',
    script:
      "Bom dia, meu compadre, bom dia, minha comadre! O sol já raiô bonito e o bule já tá no fogo. Pra começar o dia com aquela disposição de quem ama a vida, tome seu chá com a pureza que só as plantas ensinam. D'ARCO, DEIXE A NATUREZA CUIDAR DE VOCÊ!",
  },
  {
    id: 'spot-pau-darco',
    title: "O Poder Sagrado do Pau D'Arco",
    category: 'Saúde & Bem-Estar',
    durationEst: '30 seg',
    suggestedVoice: 'Fenrir',
    styleModifier: 'Radialista veterano em tom de testemunhal solene e confiável',
    description: 'Explica os benefícios medicinais do ipê-roxo e a tradição dos raizeiros.',
    script:
      "Vixe Maria, olhe praí! Nossos antepassados já sabiam o segredo guardado nas cascas da floresta. O extrato legítimo de Pau D'Arco reforça suas defesas naturais, limpa as impurezas e traz o vigor de volta pro seu organismo. É sabedoria que passa de geração em geração. D'ARCO, DEIXE A NATUREZA CUIDAR DE VOCÊ!",
  },
  {
    id: 'spot-cordel',
    title: 'Cordel da Cura pela Terra',
    category: 'Cordel',
    durationEst: '22 seg',
    suggestedVoice: 'Zephyr',
    styleModifier: 'Declamador de cordel rimado, métrica poética sertaneja',
    description: 'Versos rimados em estilo repente e literatura de cordel.',
    script:
      "Na terra onde o sol brilha com fé / E a folha verde não perde o valor / D'ARCO levanta quem cai sem vigor / Pra vida inteira ficar de pé! / D'ARCO, DEIXE A NATUREZA CUIDAR DE VOCÊ!",
  },
  {
    id: 'spot-promocao',
    title: 'Chamada de Oferta nas Farmácias Naturais',
    category: 'Promocional',
    durationEst: '25 seg',
    suggestedVoice: 'Puck',
    styleModifier: 'Locutor popular empolgado anunciando novidade nas lojas da cidade',
    description: 'Chamada dinâmica convidando a conhecer a linha completa nas lojas.',
    script:
      "Atenção minha gente de toda a região! Passe hoje mesmo na farmácia de produtos naturais da sua cidade e peça a linha completa D'ARCO. Chás selecionados, extratos concentrados e o carinho da terra em cada frasco. É arretado de bom! D'ARCO, DEIXE A NATUREZA CUIDAR DE VOCÊ!",
  },
  {
    id: 'spot-dona-cica',
    title: 'Conselho de Mãe da Terra',
    category: 'Saúde & Bem-Estar',
    durationEst: '28 seg',
    suggestedVoice: 'Kore',
    styleModifier: 'Voz maternal carinhosa, serena e profundamente acolhedora',
    description: 'Um abraço falado em tom de conversa de alpendre sobre autocuidado.',
    script:
      "Venha cá, tome um assento. Não se desgaste com tanta preocupação, não. Seu corpo é templo sagrado e precisa de alívio suave. Respire fundo, tome uma infusão das nossas ervas e sinta o aconchego no peito. D'ARCO, DEIXE A NATUREZA CUIDAR DE VOCÊ!",
  },
];

export const DARCO_PRODUCTS: DarcoProduct[] = [
  {
    id: 'cha-pau-darco',
    name: "Chá Concentrado Pau D'Arco",
    tagline: 'Casca selecionada do Ipê-Roxo da Caatinga',
    description:
      'Rico em lapachol e compostos bioativos que fortalecem a imunidade natural e restauram a vitalidade.',
    benefits: ['Ação anti-inflamatória natural', 'Fortalecimento imunológico', 'Pureza 100% silvestre'],
    spotSeed:
      "Spot especial sobre o Chá Concentrado Pau D'Arco, destacando a colheita sustentável e o alívio que ele traz para quem precisa de imunidade forte.",
    iconName: 'Leaf',
    badge: 'Carro-Chefe',
  },
  {
    id: 'extrato-fluido',
    name: "Gotas de Vitalidade D'ARCO",
    tagline: 'Extrato botânico concentrado sem álcool',
    description:
      'Gotas puras para pingar na água todas as manhãs. Absorção rápida com o poder dos fitoterápicos ancestrais.',
    benefits: ['Praticidade no dia a dia', 'Sem aditivos químicos', 'Rendimento para 30 dias'],
    spotSeed:
      "Spot de 20 segundos apresentando as Gotas de Vitalidade D'ARCO como o segredo matinal do homem e da mulher que não param.",
    iconName: 'Droplets',
    badge: 'Mais Vendido',
  },
  {
    id: 'pomada-caatinga',
    name: 'Pomada Cicatrizante da Caatinga',
    tagline: 'Bálsamo com cera de abelha nativa e aroeira',
    description:
      'Pomada milagrosa para a pele ressecada, alívio de picadas, arranhões e proteção contra o sol forte.',
    benefits: ['Regeneração intensa da pele', 'Aroma suave de resina da mata', 'Artesanal e hipoalergênica'],
    spotSeed:
      'Spot de rádio acolhedor sobre a Pomada da Caatinga, falando de alívio imediato para quem trabalha de sol a sol.',
    iconName: 'Sparkles',
    badge: 'Tradição',
  },
  {
    id: 'sabonete-artesanal',
    name: 'Sabonete Fitoterápico Alecrim & Argila',
    tagline: 'Banho de cheiro e renovação das energias',
    description:
      'Feito a frio com óleos vegetais prensados. Lava o cansaço, perfuma e deixa a pele macia como pétala.',
    benefits: ['Espuma aveludada e cremosa', 'Sensação de banho de rio', 'Óleos essenciais puros'],
    spotSeed:
      'Spot alegre sobre o sabonete artesanal D\'ARCO que transforma o banho de fim de tarde num momento revigorante.',
    iconName: 'HeartHandshake',
    badge: 'Artesanal',
  },
];
