export interface UbigeoDistrito {
  ubigeo: string;      
  departamento: string;
  provincia: string;
  distrito: string;
}

export interface UbigeoProvincia {
  codigo: string;      
  nombre: string;
  distritos: { ubigeo: string; nombre: string }[];
}

export interface UbigeoDepartamento {
  codigo: string;      
  nombre: string;
  provincias: UbigeoProvincia[];
}

export const UBIGEO_FLAT: UbigeoDistrito[] = [
  {
    "ubigeo": "010101",
    "departamento": "Bagua",
    "provincia": "Chachapoyas",
    "distrito": "Chachapoyas"
  },
  {
    "ubigeo": "010102",
    "departamento": "Bagua",
    "provincia": "Chachapoyas",
    "distrito": "Asunción"
  },
  {
    "ubigeo": "010103",
    "departamento": "Bagua",
    "provincia": "Chachapoyas",
    "distrito": "Balsas"
  },
  {
    "ubigeo": "010104",
    "departamento": "Bagua",
    "provincia": "Chachapoyas",
    "distrito": "Cheto"
  },
  {
    "ubigeo": "010105",
    "departamento": "Bagua",
    "provincia": "Chachapoyas",
    "distrito": "Chiliquin"
  },
  {
    "ubigeo": "010106",
    "departamento": "Bagua",
    "provincia": "Chachapoyas",
    "distrito": "Chuquibamba"
  },
  {
    "ubigeo": "010107",
    "departamento": "Bagua",
    "provincia": "Chachapoyas",
    "distrito": "Granada"
  },
  {
    "ubigeo": "010108",
    "departamento": "Bagua",
    "provincia": "Chachapoyas",
    "distrito": "Huancas"
  },
  {
    "ubigeo": "010109",
    "departamento": "Bagua",
    "provincia": "Chachapoyas",
    "distrito": "La Jalca"
  },
  {
    "ubigeo": "010110",
    "departamento": "Bagua",
    "provincia": "Chachapoyas",
    "distrito": "Leimebamba"
  },
  {
    "ubigeo": "010111",
    "departamento": "Bagua",
    "provincia": "Chachapoyas",
    "distrito": "Levanto"
  },
  {
    "ubigeo": "010112",
    "departamento": "Bagua",
    "provincia": "Chachapoyas",
    "distrito": "Magdalena"
  },
  {
    "ubigeo": "010113",
    "departamento": "Bagua",
    "provincia": "Chachapoyas",
    "distrito": "Mariscal Castilla"
  },
  {
    "ubigeo": "010114",
    "departamento": "Bagua",
    "provincia": "Chachapoyas",
    "distrito": "Molinopampa"
  },
  {
    "ubigeo": "010115",
    "departamento": "Bagua",
    "provincia": "Chachapoyas",
    "distrito": "Montevideo"
  },
  {
    "ubigeo": "010116",
    "departamento": "Bagua",
    "provincia": "Chachapoyas",
    "distrito": "Olleros"
  },
  {
    "ubigeo": "010117",
    "departamento": "Bagua",
    "provincia": "Chachapoyas",
    "distrito": "Quinjalca"
  },
  {
    "ubigeo": "010118",
    "departamento": "Bagua",
    "provincia": "Chachapoyas",
    "distrito": "San Francisco de Daguas"
  },
  {
    "ubigeo": "010119",
    "departamento": "Bagua",
    "provincia": "Chachapoyas",
    "distrito": "San Isidro de Maino"
  },
  {
    "ubigeo": "010120",
    "departamento": "Bagua",
    "provincia": "Chachapoyas",
    "distrito": "Soloco"
  },
  {
    "ubigeo": "010121",
    "departamento": "Bagua",
    "provincia": "Chachapoyas",
    "distrito": "Sonche"
  },
  {
    "ubigeo": "010201",
    "departamento": "Bagua",
    "provincia": "N/A",
    "distrito": "Bagua"
  },
  {
    "ubigeo": "010202",
    "departamento": "Bagua",
    "provincia": "N/A",
    "distrito": "Aramango"
  },
  {
    "ubigeo": "010203",
    "departamento": "Bagua",
    "provincia": "N/A",
    "distrito": "Copallin"
  },
  {
    "ubigeo": "010204",
    "departamento": "Bagua",
    "provincia": "N/A",
    "distrito": "El Parco"
  },
  {
    "ubigeo": "010205",
    "departamento": "Bagua",
    "provincia": "N/A",
    "distrito": "Imaza"
  },
  {
    "ubigeo": "010206",
    "departamento": "Bagua",
    "provincia": "N/A",
    "distrito": "La Peca"
  },
  {
    "ubigeo": "010301",
    "departamento": "Bagua",
    "provincia": "Bongará",
    "distrito": "Jumbilla"
  },
  {
    "ubigeo": "010302",
    "departamento": "Bagua",
    "provincia": "Bongará",
    "distrito": "Chisquilla"
  },
  {
    "ubigeo": "010303",
    "departamento": "Bagua",
    "provincia": "Bongará",
    "distrito": "Churuja"
  },
  {
    "ubigeo": "010304",
    "departamento": "Bagua",
    "provincia": "Bongará",
    "distrito": "Corosha"
  },
  {
    "ubigeo": "010305",
    "departamento": "Bagua",
    "provincia": "Bongará",
    "distrito": "Cuispes"
  },
  {
    "ubigeo": "010306",
    "departamento": "Bagua",
    "provincia": "Bongará",
    "distrito": "Florida"
  },
  {
    "ubigeo": "010307",
    "departamento": "Bagua",
    "provincia": "Bongará",
    "distrito": "Jazan"
  },
  {
    "ubigeo": "010308",
    "departamento": "Bagua",
    "provincia": "Bongará",
    "distrito": "Recta"
  },
  {
    "ubigeo": "010309",
    "departamento": "Bagua",
    "provincia": "Bongará",
    "distrito": "San Carlos"
  },
  {
    "ubigeo": "010310",
    "departamento": "Bagua",
    "provincia": "Bongará",
    "distrito": "Shipasbamba"
  },
  {
    "ubigeo": "010311",
    "departamento": "Bagua",
    "provincia": "Bongará",
    "distrito": "Valera"
  },
  {
    "ubigeo": "010312",
    "departamento": "Bagua",
    "provincia": "Bongará",
    "distrito": "Yambrasbamba"
  },
  {
    "ubigeo": "010401",
    "departamento": "Bagua",
    "provincia": "Condorcanqui",
    "distrito": "Nieva"
  },
  {
    "ubigeo": "010402",
    "departamento": "Bagua",
    "provincia": "Condorcanqui",
    "distrito": "El Cenepa"
  },
  {
    "ubigeo": "010403",
    "departamento": "Bagua",
    "provincia": "Condorcanqui",
    "distrito": "Rio Santiago"
  },
  {
    "ubigeo": "010501",
    "departamento": "Bagua",
    "provincia": "Luya",
    "distrito": "Lamud"
  },
  {
    "ubigeo": "010502",
    "departamento": "Bagua",
    "provincia": "Luya",
    "distrito": "Camporredondo"
  },
  {
    "ubigeo": "010503",
    "departamento": "Bagua",
    "provincia": "Luya",
    "distrito": "Cocabamba"
  },
  {
    "ubigeo": "010504",
    "departamento": "Bagua",
    "provincia": "Luya",
    "distrito": "Colcamar"
  },
  {
    "ubigeo": "010505",
    "departamento": "Bagua",
    "provincia": "Luya",
    "distrito": "Conila"
  },
  {
    "ubigeo": "010506",
    "departamento": "Bagua",
    "provincia": "Luya",
    "distrito": "Inguilpata"
  },
  {
    "ubigeo": "010507",
    "departamento": "Bagua",
    "provincia": "Luya",
    "distrito": "Longuita"
  },
  {
    "ubigeo": "010508",
    "departamento": "Bagua",
    "provincia": "Luya",
    "distrito": "Lonya Chico"
  },
  {
    "ubigeo": "010509",
    "departamento": "Bagua",
    "provincia": "Luya",
    "distrito": "Luya"
  },
  {
    "ubigeo": "010510",
    "departamento": "Bagua",
    "provincia": "Luya",
    "distrito": "Luya Viejo"
  },
  {
    "ubigeo": "010511",
    "departamento": "Bagua",
    "provincia": "Luya",
    "distrito": "Maria"
  },
  {
    "ubigeo": "010512",
    "departamento": "Bagua",
    "provincia": "Luya",
    "distrito": "Ocalli"
  },
  {
    "ubigeo": "010513",
    "departamento": "Bagua",
    "provincia": "Luya",
    "distrito": "Ocumal"
  },
  {
    "ubigeo": "010514",
    "departamento": "Bagua",
    "provincia": "Luya",
    "distrito": "Pisuquia"
  },
  {
    "ubigeo": "010515",
    "departamento": "Bagua",
    "provincia": "Luya",
    "distrito": "Providencia"
  },
  {
    "ubigeo": "010516",
    "departamento": "Bagua",
    "provincia": "Luya",
    "distrito": "San Cristóbal"
  },
  {
    "ubigeo": "010517",
    "departamento": "Bagua",
    "provincia": "Luya",
    "distrito": "San Francisco del Yeso"
  },
  {
    "ubigeo": "010518",
    "departamento": "Bagua",
    "provincia": "Luya",
    "distrito": "San Jerónimo"
  },
  {
    "ubigeo": "010519",
    "departamento": "Bagua",
    "provincia": "Luya",
    "distrito": "San Juan de Lopecancha"
  },
  {
    "ubigeo": "010520",
    "departamento": "Bagua",
    "provincia": "Luya",
    "distrito": "Santa Catalina"
  },
  {
    "ubigeo": "010521",
    "departamento": "Bagua",
    "provincia": "Luya",
    "distrito": "Santo Tomas"
  },
  {
    "ubigeo": "010522",
    "departamento": "Bagua",
    "provincia": "Luya",
    "distrito": "Tingo"
  },
  {
    "ubigeo": "010523",
    "departamento": "Bagua",
    "provincia": "Luya",
    "distrito": "Trita"
  },
  {
    "ubigeo": "010601",
    "departamento": "Bagua",
    "provincia": "Rodríguez de Mendoza",
    "distrito": "San Nicolas"
  },
  {
    "ubigeo": "010602",
    "departamento": "Bagua",
    "provincia": "Rodríguez de Mendoza",
    "distrito": "Chirimoto"
  },
  {
    "ubigeo": "010603",
    "departamento": "Bagua",
    "provincia": "Rodríguez de Mendoza",
    "distrito": "Cochamal"
  },
  {
    "ubigeo": "010604",
    "departamento": "Bagua",
    "provincia": "Rodríguez de Mendoza",
    "distrito": "Huambo"
  },
  {
    "ubigeo": "010605",
    "departamento": "Bagua",
    "provincia": "Rodríguez de Mendoza",
    "distrito": "Limabamba"
  },
  {
    "ubigeo": "010606",
    "departamento": "Bagua",
    "provincia": "Rodríguez de Mendoza",
    "distrito": "Longar"
  },
  {
    "ubigeo": "010607",
    "departamento": "Bagua",
    "provincia": "Rodríguez de Mendoza",
    "distrito": "Mariscal Benavides"
  },
  {
    "ubigeo": "010608",
    "departamento": "Bagua",
    "provincia": "Rodríguez de Mendoza",
    "distrito": "Milpuc"
  },
  {
    "ubigeo": "010609",
    "departamento": "Bagua",
    "provincia": "Rodríguez de Mendoza",
    "distrito": "Omia"
  },
  {
    "ubigeo": "010610",
    "departamento": "Bagua",
    "provincia": "Rodríguez de Mendoza",
    "distrito": "Santa Rosa"
  },
  {
    "ubigeo": "010611",
    "departamento": "Bagua",
    "provincia": "Rodríguez de Mendoza",
    "distrito": "Totora"
  },
  {
    "ubigeo": "010612",
    "departamento": "Bagua",
    "provincia": "Rodríguez de Mendoza",
    "distrito": "Vista Alegre"
  },
  {
    "ubigeo": "010701",
    "departamento": "Bagua",
    "provincia": "Utcubamba",
    "distrito": "Bagua Grande"
  },
  {
    "ubigeo": "010702",
    "departamento": "Bagua",
    "provincia": "Utcubamba",
    "distrito": "Cajaruro"
  },
  {
    "ubigeo": "010703",
    "departamento": "Bagua",
    "provincia": "Utcubamba",
    "distrito": "Cumba"
  },
  {
    "ubigeo": "010704",
    "departamento": "Bagua",
    "provincia": "Utcubamba",
    "distrito": "El Milagro"
  },
  {
    "ubigeo": "010705",
    "departamento": "Bagua",
    "provincia": "Utcubamba",
    "distrito": "Jamalca"
  },
  {
    "ubigeo": "010706",
    "departamento": "Bagua",
    "provincia": "Utcubamba",
    "distrito": "Lonya Grande"
  },
  {
    "ubigeo": "010707",
    "departamento": "Bagua",
    "provincia": "Utcubamba",
    "distrito": "Yamon"
  },
  {
    "ubigeo": "020101",
    "departamento": "Áncash",
    "provincia": "Huaraz",
    "distrito": "Huaraz"
  },
  {
    "ubigeo": "020102",
    "departamento": "Áncash",
    "provincia": "Huaraz",
    "distrito": "Cochabamba"
  },
  {
    "ubigeo": "020103",
    "departamento": "Áncash",
    "provincia": "Huaraz",
    "distrito": "Colcabamba"
  },
  {
    "ubigeo": "020104",
    "departamento": "Áncash",
    "provincia": "Huaraz",
    "distrito": "Huanchay"
  },
  {
    "ubigeo": "020105",
    "departamento": "Áncash",
    "provincia": "Huaraz",
    "distrito": "Independencia"
  },
  {
    "ubigeo": "020106",
    "departamento": "Áncash",
    "provincia": "Huaraz",
    "distrito": "Jangas"
  },
  {
    "ubigeo": "020107",
    "departamento": "Áncash",
    "provincia": "Huaraz",
    "distrito": "La Libertad"
  },
  {
    "ubigeo": "020108",
    "departamento": "Áncash",
    "provincia": "Huaraz",
    "distrito": "Olleros"
  },
  {
    "ubigeo": "020109",
    "departamento": "Áncash",
    "provincia": "Huaraz",
    "distrito": "Pampas"
  },
  {
    "ubigeo": "020110",
    "departamento": "Áncash",
    "provincia": "Huaraz",
    "distrito": "Pariacoto"
  },
  {
    "ubigeo": "020111",
    "departamento": "Áncash",
    "provincia": "Huaraz",
    "distrito": "Pira"
  },
  {
    "ubigeo": "020112",
    "departamento": "Áncash",
    "provincia": "Huaraz",
    "distrito": "Tarica"
  },
  {
    "ubigeo": "020201",
    "departamento": "Áncash",
    "provincia": "Aija",
    "distrito": "Aija"
  },
  {
    "ubigeo": "020202",
    "departamento": "Áncash",
    "provincia": "Aija",
    "distrito": "Coris"
  },
  {
    "ubigeo": "020203",
    "departamento": "Áncash",
    "provincia": "Aija",
    "distrito": "Huacllan"
  },
  {
    "ubigeo": "020204",
    "departamento": "Áncash",
    "provincia": "Aija",
    "distrito": "La Merced"
  },
  {
    "ubigeo": "020205",
    "departamento": "Áncash",
    "provincia": "Aija",
    "distrito": "Succha"
  },
  {
    "ubigeo": "020301",
    "departamento": "Áncash",
    "provincia": "Antonio Raymondi",
    "distrito": "Llamellin"
  },
  {
    "ubigeo": "020302",
    "departamento": "Áncash",
    "provincia": "Antonio Raymondi",
    "distrito": "Aczo"
  },
  {
    "ubigeo": "020303",
    "departamento": "Áncash",
    "provincia": "Antonio Raymondi",
    "distrito": "Chaccho"
  },
  {
    "ubigeo": "020304",
    "departamento": "Áncash",
    "provincia": "Antonio Raymondi",
    "distrito": "Chingas"
  },
  {
    "ubigeo": "020305",
    "departamento": "Áncash",
    "provincia": "Antonio Raymondi",
    "distrito": "Mirgas"
  },
  {
    "ubigeo": "020306",
    "departamento": "Áncash",
    "provincia": "Antonio Raymondi",
    "distrito": "San Juan de Rontoy"
  },
  {
    "ubigeo": "020401",
    "departamento": "Áncash",
    "provincia": "Asunción",
    "distrito": "Chacas"
  },
  {
    "ubigeo": "020402",
    "departamento": "Áncash",
    "provincia": "Asunción",
    "distrito": "Acochaca"
  },
  {
    "ubigeo": "020501",
    "departamento": "Áncash",
    "provincia": "Bolognesi",
    "distrito": "Chiquian"
  },
  {
    "ubigeo": "020502",
    "departamento": "Áncash",
    "provincia": "Bolognesi",
    "distrito": "Abelardo Pardo Lezameta"
  },
  {
    "ubigeo": "020503",
    "departamento": "Áncash",
    "provincia": "Bolognesi",
    "distrito": "Antonio Raymondi"
  },
  {
    "ubigeo": "020504",
    "departamento": "Áncash",
    "provincia": "Bolognesi",
    "distrito": "Aquia"
  },
  {
    "ubigeo": "020505",
    "departamento": "Áncash",
    "provincia": "Bolognesi",
    "distrito": "Cajacay"
  },
  {
    "ubigeo": "020506",
    "departamento": "Áncash",
    "provincia": "Bolognesi",
    "distrito": "Canis"
  },
  {
    "ubigeo": "020507",
    "departamento": "Áncash",
    "provincia": "Bolognesi",
    "distrito": "Colquioc"
  },
  {
    "ubigeo": "020508",
    "departamento": "Áncash",
    "provincia": "Bolognesi",
    "distrito": "Huallanca"
  },
  {
    "ubigeo": "020509",
    "departamento": "Áncash",
    "provincia": "Bolognesi",
    "distrito": "Huasta"
  },
  {
    "ubigeo": "020510",
    "departamento": "Áncash",
    "provincia": "Bolognesi",
    "distrito": "Huayllacayan"
  },
  {
    "ubigeo": "020511",
    "departamento": "Áncash",
    "provincia": "Bolognesi",
    "distrito": "La Primavera"
  },
  {
    "ubigeo": "020512",
    "departamento": "Áncash",
    "provincia": "Bolognesi",
    "distrito": "Mangas"
  },
  {
    "ubigeo": "020513",
    "departamento": "Áncash",
    "provincia": "Bolognesi",
    "distrito": "Pacllon"
  },
  {
    "ubigeo": "020514",
    "departamento": "Áncash",
    "provincia": "Bolognesi",
    "distrito": "San Miguel de Corpanqui"
  },
  {
    "ubigeo": "020515",
    "departamento": "Áncash",
    "provincia": "Bolognesi",
    "distrito": "Ticllos"
  },
  {
    "ubigeo": "020601",
    "departamento": "Áncash",
    "provincia": "Carhuaz",
    "distrito": "Carhuaz"
  },
  {
    "ubigeo": "020602",
    "departamento": "Áncash",
    "provincia": "Carhuaz",
    "distrito": "Acopampa"
  },
  {
    "ubigeo": "020603",
    "departamento": "Áncash",
    "provincia": "Carhuaz",
    "distrito": "Amashca"
  },
  {
    "ubigeo": "020604",
    "departamento": "Áncash",
    "provincia": "Carhuaz",
    "distrito": "Anta"
  },
  {
    "ubigeo": "020605",
    "departamento": "Áncash",
    "provincia": "Carhuaz",
    "distrito": "Ataquero"
  },
  {
    "ubigeo": "020606",
    "departamento": "Áncash",
    "provincia": "Carhuaz",
    "distrito": "Marcara"
  },
  {
    "ubigeo": "020607",
    "departamento": "Áncash",
    "provincia": "Carhuaz",
    "distrito": "Pariahuanca"
  },
  {
    "ubigeo": "020608",
    "departamento": "Áncash",
    "provincia": "Carhuaz",
    "distrito": "San Miguel de Aco"
  },
  {
    "ubigeo": "020609",
    "departamento": "Áncash",
    "provincia": "Carhuaz",
    "distrito": "Shilla"
  },
  {
    "ubigeo": "020610",
    "departamento": "Áncash",
    "provincia": "Carhuaz",
    "distrito": "Tinco"
  },
  {
    "ubigeo": "020611",
    "departamento": "Áncash",
    "provincia": "Carhuaz",
    "distrito": "Yungar"
  },
  {
    "ubigeo": "020701",
    "departamento": "Áncash",
    "provincia": "Carlos Fermín Fitzcarral",
    "distrito": "San Luis"
  },
  {
    "ubigeo": "020702",
    "departamento": "Áncash",
    "provincia": "Carlos Fermín Fitzcarral",
    "distrito": "San Nicolas"
  },
  {
    "ubigeo": "020703",
    "departamento": "Áncash",
    "provincia": "Carlos Fermín Fitzcarral",
    "distrito": "Yauya"
  },
  {
    "ubigeo": "020801",
    "departamento": "Áncash",
    "provincia": "Casma",
    "distrito": "Casma"
  },
  {
    "ubigeo": "020802",
    "departamento": "Áncash",
    "provincia": "Casma",
    "distrito": "Buena Vista Alta"
  },
  {
    "ubigeo": "020803",
    "departamento": "Áncash",
    "provincia": "Casma",
    "distrito": "Comandante Noel"
  },
  {
    "ubigeo": "020804",
    "departamento": "Áncash",
    "provincia": "Casma",
    "distrito": "Yautan"
  },
  {
    "ubigeo": "020901",
    "departamento": "Áncash",
    "provincia": "Corongo",
    "distrito": "Corongo"
  },
  {
    "ubigeo": "020902",
    "departamento": "Áncash",
    "provincia": "Corongo",
    "distrito": "Aco"
  },
  {
    "ubigeo": "020903",
    "departamento": "Áncash",
    "provincia": "Corongo",
    "distrito": "Bambas"
  },
  {
    "ubigeo": "020904",
    "departamento": "Áncash",
    "provincia": "Corongo",
    "distrito": "Cusca"
  },
  {
    "ubigeo": "020905",
    "departamento": "Áncash",
    "provincia": "Corongo",
    "distrito": "La Pampa"
  },
  {
    "ubigeo": "020906",
    "departamento": "Áncash",
    "provincia": "Corongo",
    "distrito": "Yanac"
  },
  {
    "ubigeo": "020907",
    "departamento": "Áncash",
    "provincia": "Corongo",
    "distrito": "Yupan"
  },
  {
    "ubigeo": "021001",
    "departamento": "Áncash",
    "provincia": "Huari",
    "distrito": "Huari"
  },
  {
    "ubigeo": "021002",
    "departamento": "Áncash",
    "provincia": "Huari",
    "distrito": "Anra"
  },
  {
    "ubigeo": "021003",
    "departamento": "Áncash",
    "provincia": "Huari",
    "distrito": "Cajay"
  },
  {
    "ubigeo": "021004",
    "departamento": "Áncash",
    "provincia": "Huari",
    "distrito": "Chavin de Huantar"
  },
  {
    "ubigeo": "021005",
    "departamento": "Áncash",
    "provincia": "Huari",
    "distrito": "Huacachi"
  },
  {
    "ubigeo": "021006",
    "departamento": "Áncash",
    "provincia": "Huari",
    "distrito": "Huacchis"
  },
  {
    "ubigeo": "021007",
    "departamento": "Áncash",
    "provincia": "Huari",
    "distrito": "Huachis"
  },
  {
    "ubigeo": "021008",
    "departamento": "Áncash",
    "provincia": "Huari",
    "distrito": "Huantar"
  },
  {
    "ubigeo": "021009",
    "departamento": "Áncash",
    "provincia": "Huari",
    "distrito": "Masin"
  },
  {
    "ubigeo": "021010",
    "departamento": "Áncash",
    "provincia": "Huari",
    "distrito": "Paucas"
  },
  {
    "ubigeo": "021011",
    "departamento": "Áncash",
    "provincia": "Huari",
    "distrito": "Ponto"
  },
  {
    "ubigeo": "021012",
    "departamento": "Áncash",
    "provincia": "Huari",
    "distrito": "Rahuapampa"
  },
  {
    "ubigeo": "021013",
    "departamento": "Áncash",
    "provincia": "Huari",
    "distrito": "Rapayan"
  },
  {
    "ubigeo": "021014",
    "departamento": "Áncash",
    "provincia": "Huari",
    "distrito": "San Marcos"
  },
  {
    "ubigeo": "021015",
    "departamento": "Áncash",
    "provincia": "Huari",
    "distrito": "San Pedro de Chana"
  },
  {
    "ubigeo": "021016",
    "departamento": "Áncash",
    "provincia": "Huari",
    "distrito": "Uco"
  },
  {
    "ubigeo": "021101",
    "departamento": "Áncash",
    "provincia": "Huarmey",
    "distrito": "Huarmey"
  },
  {
    "ubigeo": "021102",
    "departamento": "Áncash",
    "provincia": "Huarmey",
    "distrito": "Cochapeti"
  },
  {
    "ubigeo": "021103",
    "departamento": "Áncash",
    "provincia": "Huarmey",
    "distrito": "Culebras"
  },
  {
    "ubigeo": "021104",
    "departamento": "Áncash",
    "provincia": "Huarmey",
    "distrito": "Huayan"
  },
  {
    "ubigeo": "021105",
    "departamento": "Áncash",
    "provincia": "Huarmey",
    "distrito": "Malvas"
  },
  {
    "ubigeo": "021201",
    "departamento": "Áncash",
    "provincia": "Huaylas",
    "distrito": "Caraz"
  },
  {
    "ubigeo": "021202",
    "departamento": "Áncash",
    "provincia": "Huaylas",
    "distrito": "Huallanca"
  },
  {
    "ubigeo": "021203",
    "departamento": "Áncash",
    "provincia": "Huaylas",
    "distrito": "Huata"
  },
  {
    "ubigeo": "021204",
    "departamento": "Áncash",
    "provincia": "Huaylas",
    "distrito": "Huaylas"
  },
  {
    "ubigeo": "021205",
    "departamento": "Áncash",
    "provincia": "Huaylas",
    "distrito": "Mato"
  },
  {
    "ubigeo": "021206",
    "departamento": "Áncash",
    "provincia": "Huaylas",
    "distrito": "Pamparomas"
  },
  {
    "ubigeo": "021207",
    "departamento": "Áncash",
    "provincia": "Huaylas",
    "distrito": "Pueblo Libre"
  },
  {
    "ubigeo": "021208",
    "departamento": "Áncash",
    "provincia": "Huaylas",
    "distrito": "Santa Cruz"
  },
  {
    "ubigeo": "021209",
    "departamento": "Áncash",
    "provincia": "Huaylas",
    "distrito": "Santo Toribio"
  },
  {
    "ubigeo": "021210",
    "departamento": "Áncash",
    "provincia": "Huaylas",
    "distrito": "Yuracmarca"
  },
  {
    "ubigeo": "021301",
    "departamento": "Áncash",
    "provincia": "Mariscal Luzuriaga",
    "distrito": "Piscobamba"
  },
  {
    "ubigeo": "021302",
    "departamento": "Áncash",
    "provincia": "Mariscal Luzuriaga",
    "distrito": "Casca"
  },
  {
    "ubigeo": "021303",
    "departamento": "Áncash",
    "provincia": "Mariscal Luzuriaga",
    "distrito": "Eleazar Guzmán Barron"
  },
  {
    "ubigeo": "021304",
    "departamento": "Áncash",
    "provincia": "Mariscal Luzuriaga",
    "distrito": "Fidel Olivas Escudero"
  },
  {
    "ubigeo": "021305",
    "departamento": "Áncash",
    "provincia": "Mariscal Luzuriaga",
    "distrito": "Llama"
  },
  {
    "ubigeo": "021306",
    "departamento": "Áncash",
    "provincia": "Mariscal Luzuriaga",
    "distrito": "Llumpa"
  },
  {
    "ubigeo": "021307",
    "departamento": "Áncash",
    "provincia": "Mariscal Luzuriaga",
    "distrito": "Lucma"
  },
  {
    "ubigeo": "021308",
    "departamento": "Áncash",
    "provincia": "Mariscal Luzuriaga",
    "distrito": "Musga"
  },
  {
    "ubigeo": "021401",
    "departamento": "Áncash",
    "provincia": "Ocros",
    "distrito": "Ocros"
  },
  {
    "ubigeo": "021402",
    "departamento": "Áncash",
    "provincia": "Ocros",
    "distrito": "Acas"
  },
  {
    "ubigeo": "021403",
    "departamento": "Áncash",
    "provincia": "Ocros",
    "distrito": "Cajamarquilla"
  },
  {
    "ubigeo": "021404",
    "departamento": "Áncash",
    "provincia": "Ocros",
    "distrito": "Carhuapampa"
  },
  {
    "ubigeo": "021405",
    "departamento": "Áncash",
    "provincia": "Ocros",
    "distrito": "Cochas"
  },
  {
    "ubigeo": "021406",
    "departamento": "Áncash",
    "provincia": "Ocros",
    "distrito": "Congas"
  },
  {
    "ubigeo": "021407",
    "departamento": "Áncash",
    "provincia": "Ocros",
    "distrito": "Llipa"
  },
  {
    "ubigeo": "021408",
    "departamento": "Áncash",
    "provincia": "Ocros",
    "distrito": "San Cristóbal de Rajan"
  },
  {
    "ubigeo": "021409",
    "departamento": "Áncash",
    "provincia": "Ocros",
    "distrito": "San Pedro"
  },
  {
    "ubigeo": "021410",
    "departamento": "Áncash",
    "provincia": "Ocros",
    "distrito": "Santiago de Chilcas"
  },
  {
    "ubigeo": "021501",
    "departamento": "Áncash",
    "provincia": "Pallasca",
    "distrito": "Cabana"
  },
  {
    "ubigeo": "021502",
    "departamento": "Áncash",
    "provincia": "Pallasca",
    "distrito": "Bolognesi"
  },
  {
    "ubigeo": "021503",
    "departamento": "Áncash",
    "provincia": "Pallasca",
    "distrito": "Conchucos"
  },
  {
    "ubigeo": "021504",
    "departamento": "Áncash",
    "provincia": "Pallasca",
    "distrito": "Huacaschuque"
  },
  {
    "ubigeo": "021505",
    "departamento": "Áncash",
    "provincia": "Pallasca",
    "distrito": "Huandoval"
  },
  {
    "ubigeo": "021506",
    "departamento": "Áncash",
    "provincia": "Pallasca",
    "distrito": "Lacabamba"
  },
  {
    "ubigeo": "021507",
    "departamento": "Áncash",
    "provincia": "Pallasca",
    "distrito": "Llapo"
  },
  {
    "ubigeo": "021508",
    "departamento": "Áncash",
    "provincia": "Pallasca",
    "distrito": "Pallasca"
  },
  {
    "ubigeo": "021509",
    "departamento": "Áncash",
    "provincia": "Pallasca",
    "distrito": "Pampas"
  },
  {
    "ubigeo": "021510",
    "departamento": "Áncash",
    "provincia": "Pallasca",
    "distrito": "Santa Rosa"
  },
  {
    "ubigeo": "021511",
    "departamento": "Áncash",
    "provincia": "Pallasca",
    "distrito": "Tauca"
  },
  {
    "ubigeo": "021601",
    "departamento": "Áncash",
    "provincia": "Pomabamba",
    "distrito": "Pomabamba"
  },
  {
    "ubigeo": "021602",
    "departamento": "Áncash",
    "provincia": "Pomabamba",
    "distrito": "Huayllan"
  },
  {
    "ubigeo": "021603",
    "departamento": "Áncash",
    "provincia": "Pomabamba",
    "distrito": "Parobamba"
  },
  {
    "ubigeo": "021604",
    "departamento": "Áncash",
    "provincia": "Pomabamba",
    "distrito": "Quinuabamba"
  },
  {
    "ubigeo": "021701",
    "departamento": "Áncash",
    "provincia": "Recuay",
    "distrito": "Recuay"
  },
  {
    "ubigeo": "021702",
    "departamento": "Áncash",
    "provincia": "Recuay",
    "distrito": "Catac"
  },
  {
    "ubigeo": "021703",
    "departamento": "Áncash",
    "provincia": "Recuay",
    "distrito": "Cotaparaco"
  },
  {
    "ubigeo": "021704",
    "departamento": "Áncash",
    "provincia": "Recuay",
    "distrito": "Huayllapampa"
  },
  {
    "ubigeo": "021705",
    "departamento": "Áncash",
    "provincia": "Recuay",
    "distrito": "Llacllin"
  },
  {
    "ubigeo": "021706",
    "departamento": "Áncash",
    "provincia": "Recuay",
    "distrito": "Marca"
  },
  {
    "ubigeo": "021707",
    "departamento": "Áncash",
    "provincia": "Recuay",
    "distrito": "Pampas Chico"
  },
  {
    "ubigeo": "021708",
    "departamento": "Áncash",
    "provincia": "Recuay",
    "distrito": "Pararin"
  },
  {
    "ubigeo": "021709",
    "departamento": "Áncash",
    "provincia": "Recuay",
    "distrito": "Tapacocha"
  },
  {
    "ubigeo": "021710",
    "departamento": "Áncash",
    "provincia": "Recuay",
    "distrito": "Ticapampa"
  },
  {
    "ubigeo": "021801",
    "departamento": "Áncash",
    "provincia": "Santa",
    "distrito": "Chimbote"
  },
  {
    "ubigeo": "021802",
    "departamento": "Áncash",
    "provincia": "Santa",
    "distrito": "Cáceres del Perú"
  },
  {
    "ubigeo": "021803",
    "departamento": "Áncash",
    "provincia": "Santa",
    "distrito": "Coishco"
  },
  {
    "ubigeo": "021804",
    "departamento": "Áncash",
    "provincia": "Santa",
    "distrito": "Macate"
  },
  {
    "ubigeo": "021805",
    "departamento": "Áncash",
    "provincia": "Santa",
    "distrito": "Moro"
  },
  {
    "ubigeo": "021806",
    "departamento": "Áncash",
    "provincia": "Santa",
    "distrito": "Nepeña"
  },
  {
    "ubigeo": "021807",
    "departamento": "Áncash",
    "provincia": "Santa",
    "distrito": "Samanco"
  },
  {
    "ubigeo": "021808",
    "departamento": "Áncash",
    "provincia": "Santa",
    "distrito": "Santa"
  },
  {
    "ubigeo": "021809",
    "departamento": "Áncash",
    "provincia": "Santa",
    "distrito": "Nuevo Chimbote"
  },
  {
    "ubigeo": "021901",
    "departamento": "Áncash",
    "provincia": "Sihuas",
    "distrito": "Sihuas"
  },
  {
    "ubigeo": "021902",
    "departamento": "Áncash",
    "provincia": "Sihuas",
    "distrito": "Acobamba"
  },
  {
    "ubigeo": "021903",
    "departamento": "Áncash",
    "provincia": "Sihuas",
    "distrito": "Alfonso Ugarte"
  },
  {
    "ubigeo": "021904",
    "departamento": "Áncash",
    "provincia": "Sihuas",
    "distrito": "Cashapampa"
  },
  {
    "ubigeo": "021905",
    "departamento": "Áncash",
    "provincia": "Sihuas",
    "distrito": "Chingalpo"
  },
  {
    "ubigeo": "021906",
    "departamento": "Áncash",
    "provincia": "Sihuas",
    "distrito": "Huayllabamba"
  },
  {
    "ubigeo": "021907",
    "departamento": "Áncash",
    "provincia": "Sihuas",
    "distrito": "Quiches"
  },
  {
    "ubigeo": "021908",
    "departamento": "Áncash",
    "provincia": "Sihuas",
    "distrito": "Ragash"
  },
  {
    "ubigeo": "021909",
    "departamento": "Áncash",
    "provincia": "Sihuas",
    "distrito": "San Juan"
  },
  {
    "ubigeo": "021910",
    "departamento": "Áncash",
    "provincia": "Sihuas",
    "distrito": "Sicsibamba"
  },
  {
    "ubigeo": "022001",
    "departamento": "Áncash",
    "provincia": "Yungay",
    "distrito": "Yungay"
  },
  {
    "ubigeo": "022002",
    "departamento": "Áncash",
    "provincia": "Yungay",
    "distrito": "Cascapara"
  },
  {
    "ubigeo": "022003",
    "departamento": "Áncash",
    "provincia": "Yungay",
    "distrito": "Mancos"
  },
  {
    "ubigeo": "022004",
    "departamento": "Áncash",
    "provincia": "Yungay",
    "distrito": "Matacoto"
  },
  {
    "ubigeo": "022005",
    "departamento": "Áncash",
    "provincia": "Yungay",
    "distrito": "Quillo"
  },
  {
    "ubigeo": "022006",
    "departamento": "Áncash",
    "provincia": "Yungay",
    "distrito": "Ranrahirca"
  },
  {
    "ubigeo": "022007",
    "departamento": "Áncash",
    "provincia": "Yungay",
    "distrito": "Shupluy"
  },
  {
    "ubigeo": "022008",
    "departamento": "Áncash",
    "provincia": "Yungay",
    "distrito": "Yanama"
  },
  {
    "ubigeo": "030101",
    "departamento": "Apurímac",
    "provincia": "Abancay",
    "distrito": "Abancay"
  },
  {
    "ubigeo": "030102",
    "departamento": "Apurímac",
    "provincia": "Abancay",
    "distrito": "Chacoche"
  },
  {
    "ubigeo": "030103",
    "departamento": "Apurímac",
    "provincia": "Abancay",
    "distrito": "Circa"
  },
  {
    "ubigeo": "030104",
    "departamento": "Apurímac",
    "provincia": "Abancay",
    "distrito": "Curahuasi"
  },
  {
    "ubigeo": "030105",
    "departamento": "Apurímac",
    "provincia": "Abancay",
    "distrito": "Huanipaca"
  },
  {
    "ubigeo": "030106",
    "departamento": "Apurímac",
    "provincia": "Abancay",
    "distrito": "Lambrama"
  },
  {
    "ubigeo": "030107",
    "departamento": "Apurímac",
    "provincia": "Abancay",
    "distrito": "Pichirhua"
  },
  {
    "ubigeo": "030108",
    "departamento": "Apurímac",
    "provincia": "Abancay",
    "distrito": "San Pedro de Cachora"
  },
  {
    "ubigeo": "030109",
    "departamento": "Apurímac",
    "provincia": "Abancay",
    "distrito": "Tamburco"
  },
  {
    "ubigeo": "030201",
    "departamento": "Apurímac",
    "provincia": "Andahuaylas",
    "distrito": "Andahuaylas"
  },
  {
    "ubigeo": "030202",
    "departamento": "Apurímac",
    "provincia": "Andahuaylas",
    "distrito": "Andarapa"
  },
  {
    "ubigeo": "030203",
    "departamento": "Apurímac",
    "provincia": "Andahuaylas",
    "distrito": "Chiara"
  },
  {
    "ubigeo": "030204",
    "departamento": "Apurímac",
    "provincia": "Andahuaylas",
    "distrito": "Huancarama"
  },
  {
    "ubigeo": "030205",
    "departamento": "Apurímac",
    "provincia": "Andahuaylas",
    "distrito": "Huancaray"
  },
  {
    "ubigeo": "030206",
    "departamento": "Apurímac",
    "provincia": "Andahuaylas",
    "distrito": "Huayana"
  },
  {
    "ubigeo": "030207",
    "departamento": "Apurímac",
    "provincia": "Andahuaylas",
    "distrito": "Kishuara"
  },
  {
    "ubigeo": "030208",
    "departamento": "Apurímac",
    "provincia": "Andahuaylas",
    "distrito": "Pacobamba"
  },
  {
    "ubigeo": "030209",
    "departamento": "Apurímac",
    "provincia": "Andahuaylas",
    "distrito": "Pacucha"
  },
  {
    "ubigeo": "030210",
    "departamento": "Apurímac",
    "provincia": "Andahuaylas",
    "distrito": "Pampachiri"
  },
  {
    "ubigeo": "030211",
    "departamento": "Apurímac",
    "provincia": "Andahuaylas",
    "distrito": "Pomacocha"
  },
  {
    "ubigeo": "030212",
    "departamento": "Apurímac",
    "provincia": "Andahuaylas",
    "distrito": "San Antonio de Cachi"
  },
  {
    "ubigeo": "030213",
    "departamento": "Apurímac",
    "provincia": "Andahuaylas",
    "distrito": "San Jerónimo"
  },
  {
    "ubigeo": "030214",
    "departamento": "Apurímac",
    "provincia": "Andahuaylas",
    "distrito": "San Miguel de Chaccrampa"
  },
  {
    "ubigeo": "030215",
    "departamento": "Apurímac",
    "provincia": "Andahuaylas",
    "distrito": "Santa Maria de Chicmo"
  },
  {
    "ubigeo": "030216",
    "departamento": "Apurímac",
    "provincia": "Andahuaylas",
    "distrito": "Talavera"
  },
  {
    "ubigeo": "030217",
    "departamento": "Apurímac",
    "provincia": "Andahuaylas",
    "distrito": "Tumay Huaraca"
  },
  {
    "ubigeo": "030218",
    "departamento": "Apurímac",
    "provincia": "Andahuaylas",
    "distrito": "Turpo"
  },
  {
    "ubigeo": "030219",
    "departamento": "Apurímac",
    "provincia": "Andahuaylas",
    "distrito": "Kaquiabamba"
  },
  {
    "ubigeo": "030220",
    "departamento": "Apurímac",
    "provincia": "Andahuaylas",
    "distrito": "José María Arguedas"
  },
  {
    "ubigeo": "030301",
    "departamento": "Apurímac",
    "provincia": "Antabamba",
    "distrito": "Antabamba"
  },
  {
    "ubigeo": "030302",
    "departamento": "Apurímac",
    "provincia": "Antabamba",
    "distrito": "El Oro"
  },
  {
    "ubigeo": "030303",
    "departamento": "Apurímac",
    "provincia": "Antabamba",
    "distrito": "Huaquirca"
  },
  {
    "ubigeo": "030304",
    "departamento": "Apurímac",
    "provincia": "Antabamba",
    "distrito": "Juan Espinoza Medrano"
  },
  {
    "ubigeo": "030305",
    "departamento": "Apurímac",
    "provincia": "Antabamba",
    "distrito": "Oropesa"
  },
  {
    "ubigeo": "030306",
    "departamento": "Apurímac",
    "provincia": "Antabamba",
    "distrito": "Pachaconas"
  },
  {
    "ubigeo": "030307",
    "departamento": "Apurímac",
    "provincia": "Antabamba",
    "distrito": "Sabaino"
  },
  {
    "ubigeo": "030401",
    "departamento": "Apurímac",
    "provincia": "Aymaraes",
    "distrito": "Chalhuanca"
  },
  {
    "ubigeo": "030402",
    "departamento": "Apurímac",
    "provincia": "Aymaraes",
    "distrito": "Capaya"
  },
  {
    "ubigeo": "030403",
    "departamento": "Apurímac",
    "provincia": "Aymaraes",
    "distrito": "Caraybamba"
  },
  {
    "ubigeo": "030404",
    "departamento": "Apurímac",
    "provincia": "Aymaraes",
    "distrito": "Chapimarca"
  },
  {
    "ubigeo": "030405",
    "departamento": "Apurímac",
    "provincia": "Aymaraes",
    "distrito": "Colcabamba"
  },
  {
    "ubigeo": "030406",
    "departamento": "Apurímac",
    "provincia": "Aymaraes",
    "distrito": "Cotaruse"
  },
  {
    "ubigeo": "030407",
    "departamento": "Apurímac",
    "provincia": "Aymaraes",
    "distrito": "Huayllo"
  },
  {
    "ubigeo": "030408",
    "departamento": "Apurímac",
    "provincia": "Aymaraes",
    "distrito": "Justo Apu Sahuaraura"
  },
  {
    "ubigeo": "030409",
    "departamento": "Apurímac",
    "provincia": "Aymaraes",
    "distrito": "Lucre"
  },
  {
    "ubigeo": "030410",
    "departamento": "Apurímac",
    "provincia": "Aymaraes",
    "distrito": "Pocohuanca"
  },
  {
    "ubigeo": "030411",
    "departamento": "Apurímac",
    "provincia": "Aymaraes",
    "distrito": "San Juan de Chacña"
  },
  {
    "ubigeo": "030412",
    "departamento": "Apurímac",
    "provincia": "Aymaraes",
    "distrito": "Sañayca"
  },
  {
    "ubigeo": "030413",
    "departamento": "Apurímac",
    "provincia": "Aymaraes",
    "distrito": "Soraya"
  },
  {
    "ubigeo": "030414",
    "departamento": "Apurímac",
    "provincia": "Aymaraes",
    "distrito": "Tapairihua"
  },
  {
    "ubigeo": "030415",
    "departamento": "Apurímac",
    "provincia": "Aymaraes",
    "distrito": "Tintay"
  },
  {
    "ubigeo": "030416",
    "departamento": "Apurímac",
    "provincia": "Aymaraes",
    "distrito": "Toraya"
  },
  {
    "ubigeo": "030417",
    "departamento": "Apurímac",
    "provincia": "Aymaraes",
    "distrito": "Yanaca"
  },
  {
    "ubigeo": "030501",
    "departamento": "Apurímac",
    "provincia": "Cotabambas",
    "distrito": "Tambobamba"
  },
  {
    "ubigeo": "030502",
    "departamento": "Apurímac",
    "provincia": "Cotabambas",
    "distrito": "Cotabambas"
  },
  {
    "ubigeo": "030503",
    "departamento": "Apurímac",
    "provincia": "Cotabambas",
    "distrito": "Coyllurqui"
  },
  {
    "ubigeo": "030504",
    "departamento": "Apurímac",
    "provincia": "Cotabambas",
    "distrito": "Haquira"
  },
  {
    "ubigeo": "030505",
    "departamento": "Apurímac",
    "provincia": "Cotabambas",
    "distrito": "Mara"
  },
  {
    "ubigeo": "030506",
    "departamento": "Apurímac",
    "provincia": "Cotabambas",
    "distrito": "Challhuahuacho"
  },
  {
    "ubigeo": "030601",
    "departamento": "Apurímac",
    "provincia": "Chincheros",
    "distrito": "Chincheros"
  },
  {
    "ubigeo": "030602",
    "departamento": "Apurímac",
    "provincia": "Chincheros",
    "distrito": "Anco Huallo"
  },
  {
    "ubigeo": "030603",
    "departamento": "Apurímac",
    "provincia": "Chincheros",
    "distrito": "Cocharcas"
  },
  {
    "ubigeo": "030604",
    "departamento": "Apurímac",
    "provincia": "Chincheros",
    "distrito": "Huaccana"
  },
  {
    "ubigeo": "030605",
    "departamento": "Apurímac",
    "provincia": "Chincheros",
    "distrito": "Ocobamba"
  },
  {
    "ubigeo": "030606",
    "departamento": "Apurímac",
    "provincia": "Chincheros",
    "distrito": "Ongoy"
  },
  {
    "ubigeo": "030607",
    "departamento": "Apurímac",
    "provincia": "Chincheros",
    "distrito": "Uranmarca"
  },
  {
    "ubigeo": "030608",
    "departamento": "Apurímac",
    "provincia": "Chincheros",
    "distrito": "Ranracancha"
  },
  {
    "ubigeo": "030609",
    "departamento": "Apurímac",
    "provincia": "Chincheros",
    "distrito": "Rocchacc"
  },
  {
    "ubigeo": "030610",
    "departamento": "Apurímac",
    "provincia": "Chincheros",
    "distrito": "El Porvenir"
  },
  {
    "ubigeo": "030611",
    "departamento": "Apurímac",
    "provincia": "Chincheros",
    "distrito": "Los Chankas"
  },
  {
    "ubigeo": "030701",
    "departamento": "Apurímac",
    "provincia": "Grau",
    "distrito": "Chuquibambilla"
  },
  {
    "ubigeo": "030702",
    "departamento": "Apurímac",
    "provincia": "Grau",
    "distrito": "Curpahuasi"
  },
  {
    "ubigeo": "030703",
    "departamento": "Apurímac",
    "provincia": "Grau",
    "distrito": "Gamarra"
  },
  {
    "ubigeo": "030704",
    "departamento": "Apurímac",
    "provincia": "Grau",
    "distrito": "Huayllati"
  },
  {
    "ubigeo": "030705",
    "departamento": "Apurímac",
    "provincia": "Grau",
    "distrito": "Mamara"
  },
  {
    "ubigeo": "030706",
    "departamento": "Apurímac",
    "provincia": "Grau",
    "distrito": "Micaela Bastidas"
  },
  {
    "ubigeo": "030707",
    "departamento": "Apurímac",
    "provincia": "Grau",
    "distrito": "Pataypampa"
  },
  {
    "ubigeo": "030708",
    "departamento": "Apurímac",
    "provincia": "Grau",
    "distrito": "Progreso"
  },
  {
    "ubigeo": "030709",
    "departamento": "Apurímac",
    "provincia": "Grau",
    "distrito": "San Antonio"
  },
  {
    "ubigeo": "030710",
    "departamento": "Apurímac",
    "provincia": "Grau",
    "distrito": "Santa Rosa"
  },
  {
    "ubigeo": "030711",
    "departamento": "Apurímac",
    "provincia": "Grau",
    "distrito": "Turpay"
  },
  {
    "ubigeo": "030712",
    "departamento": "Apurímac",
    "provincia": "Grau",
    "distrito": "Vilcabamba"
  },
  {
    "ubigeo": "030713",
    "departamento": "Apurímac",
    "provincia": "Grau",
    "distrito": "Virundo"
  },
  {
    "ubigeo": "030714",
    "departamento": "Apurímac",
    "provincia": "Grau",
    "distrito": "Curasco"
  },
  {
    "ubigeo": "040101",
    "departamento": "Arequipa",
    "provincia": "Arequipa",
    "distrito": "Arequipa"
  },
  {
    "ubigeo": "040102",
    "departamento": "Arequipa",
    "provincia": "Arequipa",
    "distrito": "Alto Selva Alegre"
  },
  {
    "ubigeo": "040103",
    "departamento": "Arequipa",
    "provincia": "Arequipa",
    "distrito": "Cayma"
  },
  {
    "ubigeo": "040104",
    "departamento": "Arequipa",
    "provincia": "Arequipa",
    "distrito": "Cerro Colorado"
  },
  {
    "ubigeo": "040105",
    "departamento": "Arequipa",
    "provincia": "Arequipa",
    "distrito": "Characato"
  },
  {
    "ubigeo": "040106",
    "departamento": "Arequipa",
    "provincia": "Arequipa",
    "distrito": "Chiguata"
  },
  {
    "ubigeo": "040107",
    "departamento": "Arequipa",
    "provincia": "Arequipa",
    "distrito": "Jacobo Hunter"
  },
  {
    "ubigeo": "040108",
    "departamento": "Arequipa",
    "provincia": "Arequipa",
    "distrito": "La Joya"
  },
  {
    "ubigeo": "040109",
    "departamento": "Arequipa",
    "provincia": "Arequipa",
    "distrito": "Mariano Melgar"
  },
  {
    "ubigeo": "040110",
    "departamento": "Arequipa",
    "provincia": "Arequipa",
    "distrito": "Miraflores"
  },
  {
    "ubigeo": "040111",
    "departamento": "Arequipa",
    "provincia": "Arequipa",
    "distrito": "Mollebaya"
  },
  {
    "ubigeo": "040112",
    "departamento": "Arequipa",
    "provincia": "Arequipa",
    "distrito": "Paucarpata"
  },
  {
    "ubigeo": "040113",
    "departamento": "Arequipa",
    "provincia": "Arequipa",
    "distrito": "Pocsi"
  },
  {
    "ubigeo": "040114",
    "departamento": "Arequipa",
    "provincia": "Arequipa",
    "distrito": "Polobaya"
  },
  {
    "ubigeo": "040115",
    "departamento": "Arequipa",
    "provincia": "Arequipa",
    "distrito": "Quequeña"
  },
  {
    "ubigeo": "040116",
    "departamento": "Arequipa",
    "provincia": "Arequipa",
    "distrito": "Sabandia"
  },
  {
    "ubigeo": "040117",
    "departamento": "Arequipa",
    "provincia": "Arequipa",
    "distrito": "Sachaca"
  },
  {
    "ubigeo": "040118",
    "departamento": "Arequipa",
    "provincia": "Arequipa",
    "distrito": "San Juan de Siguas"
  },
  {
    "ubigeo": "040119",
    "departamento": "Arequipa",
    "provincia": "Arequipa",
    "distrito": "San Juan de Tarucani"
  },
  {
    "ubigeo": "040120",
    "departamento": "Arequipa",
    "provincia": "Arequipa",
    "distrito": "Santa Isabel de Siguas"
  },
  {
    "ubigeo": "040121",
    "departamento": "Arequipa",
    "provincia": "Arequipa",
    "distrito": "Santa Rita de Siguas"
  },
  {
    "ubigeo": "040122",
    "departamento": "Arequipa",
    "provincia": "Arequipa",
    "distrito": "Socabaya"
  },
  {
    "ubigeo": "040123",
    "departamento": "Arequipa",
    "provincia": "Arequipa",
    "distrito": "Tiabaya"
  },
  {
    "ubigeo": "040124",
    "departamento": "Arequipa",
    "provincia": "Arequipa",
    "distrito": "Uchumayo"
  },
  {
    "ubigeo": "040125",
    "departamento": "Arequipa",
    "provincia": "Arequipa",
    "distrito": "Vitor"
  },
  {
    "ubigeo": "040126",
    "departamento": "Arequipa",
    "provincia": "Arequipa",
    "distrito": "Yanahuara"
  },
  {
    "ubigeo": "040127",
    "departamento": "Arequipa",
    "provincia": "Arequipa",
    "distrito": "Yarabamba"
  },
  {
    "ubigeo": "040128",
    "departamento": "Arequipa",
    "provincia": "Arequipa",
    "distrito": "Yura"
  },
  {
    "ubigeo": "040129",
    "departamento": "Arequipa",
    "provincia": "Arequipa",
    "distrito": "Jose Luis Bustamante y Rivero"
  },
  {
    "ubigeo": "040201",
    "departamento": "Arequipa",
    "provincia": "Camaná",
    "distrito": "Camaná"
  },
  {
    "ubigeo": "040202",
    "departamento": "Arequipa",
    "provincia": "Camaná",
    "distrito": "Jose Maria Quimper"
  },
  {
    "ubigeo": "040203",
    "departamento": "Arequipa",
    "provincia": "Camaná",
    "distrito": "Mariano Nicolas Valcárcel"
  },
  {
    "ubigeo": "040204",
    "departamento": "Arequipa",
    "provincia": "Camaná",
    "distrito": "Mariscal Cáceres"
  },
  {
    "ubigeo": "040205",
    "departamento": "Arequipa",
    "provincia": "Camaná",
    "distrito": "Nicolas de Pierola"
  },
  {
    "ubigeo": "040206",
    "departamento": "Arequipa",
    "provincia": "Camaná",
    "distrito": "Ocoña"
  },
  {
    "ubigeo": "040207",
    "departamento": "Arequipa",
    "provincia": "Camaná",
    "distrito": "Quilca"
  },
  {
    "ubigeo": "040208",
    "departamento": "Arequipa",
    "provincia": "Camaná",
    "distrito": "Samuel Pastor"
  },
  {
    "ubigeo": "040301",
    "departamento": "Arequipa",
    "provincia": "Caravelí",
    "distrito": "Caravelí"
  },
  {
    "ubigeo": "040302",
    "departamento": "Arequipa",
    "provincia": "Caravelí",
    "distrito": "Acarí"
  },
  {
    "ubigeo": "040303",
    "departamento": "Arequipa",
    "provincia": "Caravelí",
    "distrito": "Atico"
  },
  {
    "ubigeo": "040304",
    "departamento": "Arequipa",
    "provincia": "Caravelí",
    "distrito": "Atiquipa"
  },
  {
    "ubigeo": "040305",
    "departamento": "Arequipa",
    "provincia": "Caravelí",
    "distrito": "Bella Union"
  },
  {
    "ubigeo": "040306",
    "departamento": "Arequipa",
    "provincia": "Caravelí",
    "distrito": "Cahuacho"
  },
  {
    "ubigeo": "040307",
    "departamento": "Arequipa",
    "provincia": "Caravelí",
    "distrito": "Chala"
  },
  {
    "ubigeo": "040308",
    "departamento": "Arequipa",
    "provincia": "Caravelí",
    "distrito": "Chaparra"
  },
  {
    "ubigeo": "040309",
    "departamento": "Arequipa",
    "provincia": "Caravelí",
    "distrito": "Huanuhuanu"
  },
  {
    "ubigeo": "040310",
    "departamento": "Arequipa",
    "provincia": "Caravelí",
    "distrito": "Jaqui"
  },
  {
    "ubigeo": "040311",
    "departamento": "Arequipa",
    "provincia": "Caravelí",
    "distrito": "Lomas"
  },
  {
    "ubigeo": "040312",
    "departamento": "Arequipa",
    "provincia": "Caravelí",
    "distrito": "Quicacha"
  },
  {
    "ubigeo": "040313",
    "departamento": "Arequipa",
    "provincia": "Caravelí",
    "distrito": "Yauca"
  },
  {
    "ubigeo": "040401",
    "departamento": "Arequipa",
    "provincia": "Castilla",
    "distrito": "Aplao"
  },
  {
    "ubigeo": "040402",
    "departamento": "Arequipa",
    "provincia": "Castilla",
    "distrito": "Andagua"
  },
  {
    "ubigeo": "040403",
    "departamento": "Arequipa",
    "provincia": "Castilla",
    "distrito": "Ayo"
  },
  {
    "ubigeo": "040404",
    "departamento": "Arequipa",
    "provincia": "Castilla",
    "distrito": "Chachas"
  },
  {
    "ubigeo": "040405",
    "departamento": "Arequipa",
    "provincia": "Castilla",
    "distrito": "Chilcaymarca"
  },
  {
    "ubigeo": "040406",
    "departamento": "Arequipa",
    "provincia": "Castilla",
    "distrito": "Choco"
  },
  {
    "ubigeo": "040407",
    "departamento": "Arequipa",
    "provincia": "Castilla",
    "distrito": "Huancarqui"
  },
  {
    "ubigeo": "040408",
    "departamento": "Arequipa",
    "provincia": "Castilla",
    "distrito": "Machaguay"
  },
  {
    "ubigeo": "040409",
    "departamento": "Arequipa",
    "provincia": "Castilla",
    "distrito": "Orcopampa"
  },
  {
    "ubigeo": "040410",
    "departamento": "Arequipa",
    "provincia": "Castilla",
    "distrito": "Pampacolca"
  },
  {
    "ubigeo": "040411",
    "departamento": "Arequipa",
    "provincia": "Castilla",
    "distrito": "Tipan"
  },
  {
    "ubigeo": "040412",
    "departamento": "Arequipa",
    "provincia": "Castilla",
    "distrito": "Uñon"
  },
  {
    "ubigeo": "040413",
    "departamento": "Arequipa",
    "provincia": "Castilla",
    "distrito": "Uraca"
  },
  {
    "ubigeo": "040414",
    "departamento": "Arequipa",
    "provincia": "Castilla",
    "distrito": "Viraco"
  },
  {
    "ubigeo": "040501",
    "departamento": "Arequipa",
    "provincia": "Caylloma",
    "distrito": "Chivay"
  },
  {
    "ubigeo": "040502",
    "departamento": "Arequipa",
    "provincia": "Caylloma",
    "distrito": "Achoma"
  },
  {
    "ubigeo": "040503",
    "departamento": "Arequipa",
    "provincia": "Caylloma",
    "distrito": "Cabanaconde"
  },
  {
    "ubigeo": "040504",
    "departamento": "Arequipa",
    "provincia": "Caylloma",
    "distrito": "Callalli"
  },
  {
    "ubigeo": "040505",
    "departamento": "Arequipa",
    "provincia": "Caylloma",
    "distrito": "Caylloma"
  },
  {
    "ubigeo": "040506",
    "departamento": "Arequipa",
    "provincia": "Caylloma",
    "distrito": "Coporaque"
  },
  {
    "ubigeo": "040507",
    "departamento": "Arequipa",
    "provincia": "Caylloma",
    "distrito": "Huambo"
  },
  {
    "ubigeo": "040508",
    "departamento": "Arequipa",
    "provincia": "Caylloma",
    "distrito": "Huanca"
  },
  {
    "ubigeo": "040509",
    "departamento": "Arequipa",
    "provincia": "Caylloma",
    "distrito": "Ichupampa"
  },
  {
    "ubigeo": "040510",
    "departamento": "Arequipa",
    "provincia": "Caylloma",
    "distrito": "Lari"
  },
  {
    "ubigeo": "040511",
    "departamento": "Arequipa",
    "provincia": "Caylloma",
    "distrito": "Lluta"
  },
  {
    "ubigeo": "040512",
    "departamento": "Arequipa",
    "provincia": "Caylloma",
    "distrito": "Maca"
  },
  {
    "ubigeo": "040513",
    "departamento": "Arequipa",
    "provincia": "Caylloma",
    "distrito": "Madrigal"
  },
  {
    "ubigeo": "040514",
    "departamento": "Arequipa",
    "provincia": "Caylloma",
    "distrito": "San Antonio de Chuca"
  },
  {
    "ubigeo": "040515",
    "departamento": "Arequipa",
    "provincia": "Caylloma",
    "distrito": "Sibayo"
  },
  {
    "ubigeo": "040516",
    "departamento": "Arequipa",
    "provincia": "Caylloma",
    "distrito": "Tapay"
  },
  {
    "ubigeo": "040517",
    "departamento": "Arequipa",
    "provincia": "Caylloma",
    "distrito": "Tisco"
  },
  {
    "ubigeo": "040518",
    "departamento": "Arequipa",
    "provincia": "Caylloma",
    "distrito": "Tuti"
  },
  {
    "ubigeo": "040519",
    "departamento": "Arequipa",
    "provincia": "Caylloma",
    "distrito": "Yanque"
  },
  {
    "ubigeo": "040520",
    "departamento": "Arequipa",
    "provincia": "Caylloma",
    "distrito": "Majes"
  },
  {
    "ubigeo": "040601",
    "departamento": "Arequipa",
    "provincia": "Condesuyos",
    "distrito": "Chuquibamba"
  },
  {
    "ubigeo": "040602",
    "departamento": "Arequipa",
    "provincia": "Condesuyos",
    "distrito": "Andaray"
  },
  {
    "ubigeo": "040603",
    "departamento": "Arequipa",
    "provincia": "Condesuyos",
    "distrito": "Cayarani"
  },
  {
    "ubigeo": "040604",
    "departamento": "Arequipa",
    "provincia": "Condesuyos",
    "distrito": "Chichas"
  },
  {
    "ubigeo": "040605",
    "departamento": "Arequipa",
    "provincia": "Condesuyos",
    "distrito": "Iray"
  },
  {
    "ubigeo": "040606",
    "departamento": "Arequipa",
    "provincia": "Condesuyos",
    "distrito": "Rio Grande"
  },
  {
    "ubigeo": "040607",
    "departamento": "Arequipa",
    "provincia": "Condesuyos",
    "distrito": "Salamanca"
  },
  {
    "ubigeo": "040608",
    "departamento": "Arequipa",
    "provincia": "Condesuyos",
    "distrito": "Yanaquihua"
  },
  {
    "ubigeo": "040701",
    "departamento": "Arequipa",
    "provincia": "Islay",
    "distrito": "Mollendo"
  },
  {
    "ubigeo": "040702",
    "departamento": "Arequipa",
    "provincia": "Islay",
    "distrito": "Cocachacra"
  },
  {
    "ubigeo": "040703",
    "departamento": "Arequipa",
    "provincia": "Islay",
    "distrito": "Dean Valdivia"
  },
  {
    "ubigeo": "040704",
    "departamento": "Arequipa",
    "provincia": "Islay",
    "distrito": "Islay"
  },
  {
    "ubigeo": "040705",
    "departamento": "Arequipa",
    "provincia": "Islay",
    "distrito": "Mejia"
  },
  {
    "ubigeo": "040706",
    "departamento": "Arequipa",
    "provincia": "Islay",
    "distrito": "Punta de Bombón"
  },
  {
    "ubigeo": "040801",
    "departamento": "Arequipa",
    "provincia": "La Union",
    "distrito": "Cotahuasi"
  },
  {
    "ubigeo": "040802",
    "departamento": "Arequipa",
    "provincia": "La Union",
    "distrito": "Alca"
  },
  {
    "ubigeo": "040803",
    "departamento": "Arequipa",
    "provincia": "La Union",
    "distrito": "Charcana"
  },
  {
    "ubigeo": "040804",
    "departamento": "Arequipa",
    "provincia": "La Union",
    "distrito": "Huaynacotas"
  },
  {
    "ubigeo": "040805",
    "departamento": "Arequipa",
    "provincia": "La Union",
    "distrito": "Pampamarca"
  },
  {
    "ubigeo": "040806",
    "departamento": "Arequipa",
    "provincia": "La Union",
    "distrito": "Puyca"
  },
  {
    "ubigeo": "040807",
    "departamento": "Arequipa",
    "provincia": "La Union",
    "distrito": "Quechualla"
  },
  {
    "ubigeo": "040808",
    "departamento": "Arequipa",
    "provincia": "La Union",
    "distrito": "Sayla"
  },
  {
    "ubigeo": "040809",
    "departamento": "Arequipa",
    "provincia": "La Union",
    "distrito": "Tauria"
  },
  {
    "ubigeo": "040810",
    "departamento": "Arequipa",
    "provincia": "La Union",
    "distrito": "Tomepampa"
  },
  {
    "ubigeo": "040811",
    "departamento": "Arequipa",
    "provincia": "La Union",
    "distrito": "Toro"
  },
  {
    "ubigeo": "050101",
    "departamento": "Ayacucho",
    "provincia": "Huamanga",
    "distrito": "Ayacucho"
  },
  {
    "ubigeo": "050102",
    "departamento": "Ayacucho",
    "provincia": "Huamanga",
    "distrito": "Acocro"
  },
  {
    "ubigeo": "050103",
    "departamento": "Ayacucho",
    "provincia": "Huamanga",
    "distrito": "Acos Vinchos"
  },
  {
    "ubigeo": "050104",
    "departamento": "Ayacucho",
    "provincia": "Huamanga",
    "distrito": "Carmen Alto"
  },
  {
    "ubigeo": "050105",
    "departamento": "Ayacucho",
    "provincia": "Huamanga",
    "distrito": "Chiara"
  },
  {
    "ubigeo": "050106",
    "departamento": "Ayacucho",
    "provincia": "Huamanga",
    "distrito": "Ocros"
  },
  {
    "ubigeo": "050107",
    "departamento": "Ayacucho",
    "provincia": "Huamanga",
    "distrito": "Pacaycasa"
  },
  {
    "ubigeo": "050108",
    "departamento": "Ayacucho",
    "provincia": "Huamanga",
    "distrito": "Quinua"
  },
  {
    "ubigeo": "050109",
    "departamento": "Ayacucho",
    "provincia": "Huamanga",
    "distrito": "San Jose de Ticllas"
  },
  {
    "ubigeo": "050110",
    "departamento": "Ayacucho",
    "provincia": "Huamanga",
    "distrito": "San Juan Bautista"
  },
  {
    "ubigeo": "050111",
    "departamento": "Ayacucho",
    "provincia": "Huamanga",
    "distrito": "Santiago de Pischa"
  },
  {
    "ubigeo": "050112",
    "departamento": "Ayacucho",
    "provincia": "Huamanga",
    "distrito": "Socos"
  },
  {
    "ubigeo": "050113",
    "departamento": "Ayacucho",
    "provincia": "Huamanga",
    "distrito": "Tambillo"
  },
  {
    "ubigeo": "050114",
    "departamento": "Ayacucho",
    "provincia": "Huamanga",
    "distrito": "Vinchos"
  },
  {
    "ubigeo": "050115",
    "departamento": "Ayacucho",
    "provincia": "Huamanga",
    "distrito": "Jesus Nazareno"
  },
  {
    "ubigeo": "050116",
    "departamento": "Ayacucho",
    "provincia": "Huamanga",
    "distrito": "Andrés Avelino Cáceres Dorregaray"
  },
  {
    "ubigeo": "050201",
    "departamento": "Ayacucho",
    "provincia": "Cangallo",
    "distrito": "Cangallo"
  },
  {
    "ubigeo": "050202",
    "departamento": "Ayacucho",
    "provincia": "Cangallo",
    "distrito": "Chuschi"
  },
  {
    "ubigeo": "050203",
    "departamento": "Ayacucho",
    "provincia": "Cangallo",
    "distrito": "Los Morochucos"
  },
  {
    "ubigeo": "050204",
    "departamento": "Ayacucho",
    "provincia": "Cangallo",
    "distrito": "Maria Parado de Bellido"
  },
  {
    "ubigeo": "050205",
    "departamento": "Ayacucho",
    "provincia": "Cangallo",
    "distrito": "Paras"
  },
  {
    "ubigeo": "050206",
    "departamento": "Ayacucho",
    "provincia": "Cangallo",
    "distrito": "Totos"
  },
  {
    "ubigeo": "050301",
    "departamento": "Ayacucho",
    "provincia": "Huanca Sancos",
    "distrito": "Sancos"
  },
  {
    "ubigeo": "050302",
    "departamento": "Ayacucho",
    "provincia": "Huanca Sancos",
    "distrito": "Carapo"
  },
  {
    "ubigeo": "050303",
    "departamento": "Ayacucho",
    "provincia": "Huanca Sancos",
    "distrito": "Sacsamarca"
  },
  {
    "ubigeo": "050304",
    "departamento": "Ayacucho",
    "provincia": "Huanca Sancos",
    "distrito": "Santiago de Lucanamarca"
  },
  {
    "ubigeo": "050401",
    "departamento": "Ayacucho",
    "provincia": "Huanta",
    "distrito": "Huanta"
  },
  {
    "ubigeo": "050402",
    "departamento": "Ayacucho",
    "provincia": "Huanta",
    "distrito": "Ayahuanco"
  },
  {
    "ubigeo": "050403",
    "departamento": "Ayacucho",
    "provincia": "Huanta",
    "distrito": "Huamanguilla"
  },
  {
    "ubigeo": "050404",
    "departamento": "Ayacucho",
    "provincia": "Huanta",
    "distrito": "Iguain"
  },
  {
    "ubigeo": "050405",
    "departamento": "Ayacucho",
    "provincia": "Huanta",
    "distrito": "Luricocha"
  },
  {
    "ubigeo": "050406",
    "departamento": "Ayacucho",
    "provincia": "Huanta",
    "distrito": "Santillana"
  },
  {
    "ubigeo": "050407",
    "departamento": "Ayacucho",
    "provincia": "Huanta",
    "distrito": "Sivia"
  },
  {
    "ubigeo": "050408",
    "departamento": "Ayacucho",
    "provincia": "Huanta",
    "distrito": "Llochegua"
  },
  {
    "ubigeo": "050409",
    "departamento": "Ayacucho",
    "provincia": "Huanta",
    "distrito": "Canayre"
  },
  {
    "ubigeo": "050410",
    "departamento": "Ayacucho",
    "provincia": "Huanta",
    "distrito": "Uchuraccay"
  },
  {
    "ubigeo": "050411",
    "departamento": "Ayacucho",
    "provincia": "Huanta",
    "distrito": "Pucacolpa"
  },
  {
    "ubigeo": "050412",
    "departamento": "Ayacucho",
    "provincia": "Huanta",
    "distrito": "Chaca"
  },
  {
    "ubigeo": "050501",
    "departamento": "Ayacucho",
    "provincia": "La Mar",
    "distrito": "San Miguel"
  },
  {
    "ubigeo": "050502",
    "departamento": "Ayacucho",
    "provincia": "La Mar",
    "distrito": "Anco"
  },
  {
    "ubigeo": "050503",
    "departamento": "Ayacucho",
    "provincia": "La Mar",
    "distrito": "Ayna"
  },
  {
    "ubigeo": "050504",
    "departamento": "Ayacucho",
    "provincia": "La Mar",
    "distrito": "Chilcas"
  },
  {
    "ubigeo": "050505",
    "departamento": "Ayacucho",
    "provincia": "La Mar",
    "distrito": "Chungui"
  },
  {
    "ubigeo": "050506",
    "departamento": "Ayacucho",
    "provincia": "La Mar",
    "distrito": "Luis Carranza"
  },
  {
    "ubigeo": "050507",
    "departamento": "Ayacucho",
    "provincia": "La Mar",
    "distrito": "Santa Rosa"
  },
  {
    "ubigeo": "050508",
    "departamento": "Ayacucho",
    "provincia": "La Mar",
    "distrito": "Tambo"
  },
  {
    "ubigeo": "050509",
    "departamento": "Ayacucho",
    "provincia": "La Mar",
    "distrito": "Samugari"
  },
  {
    "ubigeo": "050510",
    "departamento": "Ayacucho",
    "provincia": "La Mar",
    "distrito": "Anchihuay"
  },
  {
    "ubigeo": "050511",
    "departamento": "Ayacucho",
    "provincia": "La Mar",
    "distrito": "Oronccoy"
  },
  {
    "ubigeo": "050601",
    "departamento": "Ayacucho",
    "provincia": "Lucanas",
    "distrito": "Puquio"
  },
  {
    "ubigeo": "050602",
    "departamento": "Ayacucho",
    "provincia": "Lucanas",
    "distrito": "Aucara"
  },
  {
    "ubigeo": "050603",
    "departamento": "Ayacucho",
    "provincia": "Lucanas",
    "distrito": "Cabana"
  },
  {
    "ubigeo": "050604",
    "departamento": "Ayacucho",
    "provincia": "Lucanas",
    "distrito": "Carmen Salcedo"
  },
  {
    "ubigeo": "050605",
    "departamento": "Ayacucho",
    "provincia": "Lucanas",
    "distrito": "Chaviña"
  },
  {
    "ubigeo": "050606",
    "departamento": "Ayacucho",
    "provincia": "Lucanas",
    "distrito": "Chipao"
  },
  {
    "ubigeo": "050607",
    "departamento": "Ayacucho",
    "provincia": "Lucanas",
    "distrito": "Huac-Huas"
  },
  {
    "ubigeo": "050608",
    "departamento": "Ayacucho",
    "provincia": "Lucanas",
    "distrito": "Laramate"
  },
  {
    "ubigeo": "050609",
    "departamento": "Ayacucho",
    "provincia": "Lucanas",
    "distrito": "Leoncio Prado"
  },
  {
    "ubigeo": "050610",
    "departamento": "Ayacucho",
    "provincia": "Lucanas",
    "distrito": "Llauta"
  },
  {
    "ubigeo": "050611",
    "departamento": "Ayacucho",
    "provincia": "Lucanas",
    "distrito": "Lucanas"
  },
  {
    "ubigeo": "050612",
    "departamento": "Ayacucho",
    "provincia": "Lucanas",
    "distrito": "Ocaña"
  },
  {
    "ubigeo": "050613",
    "departamento": "Ayacucho",
    "provincia": "Lucanas",
    "distrito": "Otoca"
  },
  {
    "ubigeo": "050614",
    "departamento": "Ayacucho",
    "provincia": "Lucanas",
    "distrito": "Saisa"
  },
  {
    "ubigeo": "050615",
    "departamento": "Ayacucho",
    "provincia": "Lucanas",
    "distrito": "San Cristóbal"
  },
  {
    "ubigeo": "050616",
    "departamento": "Ayacucho",
    "provincia": "Lucanas",
    "distrito": "San Juan"
  },
  {
    "ubigeo": "050617",
    "departamento": "Ayacucho",
    "provincia": "Lucanas",
    "distrito": "San Pedro"
  },
  {
    "ubigeo": "050618",
    "departamento": "Ayacucho",
    "provincia": "Lucanas",
    "distrito": "San Pedro de Palco"
  },
  {
    "ubigeo": "050619",
    "departamento": "Ayacucho",
    "provincia": "Lucanas",
    "distrito": "Sancos"
  },
  {
    "ubigeo": "050620",
    "departamento": "Ayacucho",
    "provincia": "Lucanas",
    "distrito": "Santa Ana de Huaycahuacho"
  },
  {
    "ubigeo": "050621",
    "departamento": "Ayacucho",
    "provincia": "Lucanas",
    "distrito": "Santa Lucia"
  },
  {
    "ubigeo": "050701",
    "departamento": "Ayacucho",
    "provincia": "Parinacochas",
    "distrito": "Coracora"
  },
  {
    "ubigeo": "050702",
    "departamento": "Ayacucho",
    "provincia": "Parinacochas",
    "distrito": "Chumpi"
  },
  {
    "ubigeo": "050703",
    "departamento": "Ayacucho",
    "provincia": "Parinacochas",
    "distrito": "Coronel Castañeda"
  },
  {
    "ubigeo": "050704",
    "departamento": "Ayacucho",
    "provincia": "Parinacochas",
    "distrito": "Pacapausa"
  },
  {
    "ubigeo": "050705",
    "departamento": "Ayacucho",
    "provincia": "Parinacochas",
    "distrito": "Pullo"
  },
  {
    "ubigeo": "050706",
    "departamento": "Ayacucho",
    "provincia": "Parinacochas",
    "distrito": "Puyusca"
  },
  {
    "ubigeo": "050707",
    "departamento": "Ayacucho",
    "provincia": "Parinacochas",
    "distrito": "San Francisco de Ravacayco"
  },
  {
    "ubigeo": "050708",
    "departamento": "Ayacucho",
    "provincia": "Parinacochas",
    "distrito": "Upahuacho"
  },
  {
    "ubigeo": "050801",
    "departamento": "Ayacucho",
    "provincia": "Paucar del Sara Sara",
    "distrito": "Pausa"
  },
  {
    "ubigeo": "050802",
    "departamento": "Ayacucho",
    "provincia": "Paucar del Sara Sara",
    "distrito": "Colta"
  },
  {
    "ubigeo": "050803",
    "departamento": "Ayacucho",
    "provincia": "Paucar del Sara Sara",
    "distrito": "Corculla"
  },
  {
    "ubigeo": "050804",
    "departamento": "Ayacucho",
    "provincia": "Paucar del Sara Sara",
    "distrito": "Lampa"
  },
  {
    "ubigeo": "050805",
    "departamento": "Ayacucho",
    "provincia": "Paucar del Sara Sara",
    "distrito": "Marcabamba"
  },
  {
    "ubigeo": "050806",
    "departamento": "Ayacucho",
    "provincia": "Paucar del Sara Sara",
    "distrito": "Oyolo"
  },
  {
    "ubigeo": "050807",
    "departamento": "Ayacucho",
    "provincia": "Paucar del Sara Sara",
    "distrito": "Pararca"
  },
  {
    "ubigeo": "050808",
    "departamento": "Ayacucho",
    "provincia": "Paucar del Sara Sara",
    "distrito": "San Javier de Alpabamba"
  },
  {
    "ubigeo": "050809",
    "departamento": "Ayacucho",
    "provincia": "Paucar del Sara Sara",
    "distrito": "San Jose de Ushua"
  },
  {
    "ubigeo": "050810",
    "departamento": "Ayacucho",
    "provincia": "Paucar del Sara Sara",
    "distrito": "Sara Sara"
  },
  {
    "ubigeo": "050901",
    "departamento": "Ayacucho",
    "provincia": "Sucre",
    "distrito": "Querobamba"
  },
  {
    "ubigeo": "050902",
    "departamento": "Ayacucho",
    "provincia": "Sucre",
    "distrito": "Belén"
  },
  {
    "ubigeo": "050903",
    "departamento": "Ayacucho",
    "provincia": "Sucre",
    "distrito": "Chalcos"
  },
  {
    "ubigeo": "050904",
    "departamento": "Ayacucho",
    "provincia": "Sucre",
    "distrito": "Chilcayoc"
  },
  {
    "ubigeo": "050905",
    "departamento": "Ayacucho",
    "provincia": "Sucre",
    "distrito": "Huacaña"
  },
  {
    "ubigeo": "050906",
    "departamento": "Ayacucho",
    "provincia": "Sucre",
    "distrito": "Morcolla"
  },
  {
    "ubigeo": "050907",
    "departamento": "Ayacucho",
    "provincia": "Sucre",
    "distrito": "Paico"
  },
  {
    "ubigeo": "050908",
    "departamento": "Ayacucho",
    "provincia": "Sucre",
    "distrito": "San Pedro de Larcay"
  },
  {
    "ubigeo": "050909",
    "departamento": "Ayacucho",
    "provincia": "Sucre",
    "distrito": "San Salvador de Quije"
  },
  {
    "ubigeo": "050910",
    "departamento": "Ayacucho",
    "provincia": "Sucre",
    "distrito": "Santiago de Paucaray"
  },
  {
    "ubigeo": "050911",
    "departamento": "Ayacucho",
    "provincia": "Sucre",
    "distrito": "Soras"
  },
  {
    "ubigeo": "051001",
    "departamento": "Ayacucho",
    "provincia": "Victor Fajardo",
    "distrito": "Huancapi"
  },
  {
    "ubigeo": "051002",
    "departamento": "Ayacucho",
    "provincia": "Victor Fajardo",
    "distrito": "Alcamenca"
  },
  {
    "ubigeo": "051003",
    "departamento": "Ayacucho",
    "provincia": "Victor Fajardo",
    "distrito": "Apongo"
  },
  {
    "ubigeo": "051004",
    "departamento": "Ayacucho",
    "provincia": "Victor Fajardo",
    "distrito": "Asquipata"
  },
  {
    "ubigeo": "051005",
    "departamento": "Ayacucho",
    "provincia": "Victor Fajardo",
    "distrito": "Canaria"
  },
  {
    "ubigeo": "051006",
    "departamento": "Ayacucho",
    "provincia": "Victor Fajardo",
    "distrito": "Cayara"
  },
  {
    "ubigeo": "051007",
    "departamento": "Ayacucho",
    "provincia": "Victor Fajardo",
    "distrito": "Colca"
  },
  {
    "ubigeo": "051008",
    "departamento": "Ayacucho",
    "provincia": "Victor Fajardo",
    "distrito": "Huamanquiquia"
  },
  {
    "ubigeo": "051009",
    "departamento": "Ayacucho",
    "provincia": "Victor Fajardo",
    "distrito": "Huancaraylla"
  },
  {
    "ubigeo": "051010",
    "departamento": "Ayacucho",
    "provincia": "Victor Fajardo",
    "distrito": "Huaya"
  },
  {
    "ubigeo": "051011",
    "departamento": "Ayacucho",
    "provincia": "Victor Fajardo",
    "distrito": "Sarhua"
  },
  {
    "ubigeo": "051012",
    "departamento": "Ayacucho",
    "provincia": "Victor Fajardo",
    "distrito": "Vilcanchos"
  },
  {
    "ubigeo": "051101",
    "departamento": "Ayacucho",
    "provincia": "Vilcas Huaman",
    "distrito": "Vilcas Huaman"
  },
  {
    "ubigeo": "051102",
    "departamento": "Ayacucho",
    "provincia": "Vilcas Huaman",
    "distrito": "Accomarca"
  },
  {
    "ubigeo": "051103",
    "departamento": "Ayacucho",
    "provincia": "Vilcas Huaman",
    "distrito": "Carhuanca"
  },
  {
    "ubigeo": "051104",
    "departamento": "Ayacucho",
    "provincia": "Vilcas Huaman",
    "distrito": "Concepcion"
  },
  {
    "ubigeo": "051105",
    "departamento": "Ayacucho",
    "provincia": "Vilcas Huaman",
    "distrito": "Huambalpa"
  },
  {
    "ubigeo": "051106",
    "departamento": "Ayacucho",
    "provincia": "Vilcas Huaman",
    "distrito": "Independencia"
  },
  {
    "ubigeo": "051107",
    "departamento": "Ayacucho",
    "provincia": "Vilcas Huaman",
    "distrito": "Saurama"
  },
  {
    "ubigeo": "051108",
    "departamento": "Ayacucho",
    "provincia": "Vilcas Huaman",
    "distrito": "Vischongo"
  },
  {
    "ubigeo": "060101",
    "departamento": "Cajamarca",
    "provincia": "Cajamarca",
    "distrito": "Cajamarca"
  },
  {
    "ubigeo": "060102",
    "departamento": "Cajamarca",
    "provincia": "Cajamarca",
    "distrito": "Asunción"
  },
  {
    "ubigeo": "060103",
    "departamento": "Cajamarca",
    "provincia": "Cajamarca",
    "distrito": "Chetilla"
  },
  {
    "ubigeo": "060104",
    "departamento": "Cajamarca",
    "provincia": "Cajamarca",
    "distrito": "Cospan"
  },
  {
    "ubigeo": "060105",
    "departamento": "Cajamarca",
    "provincia": "Cajamarca",
    "distrito": "Encañada"
  },
  {
    "ubigeo": "060106",
    "departamento": "Cajamarca",
    "provincia": "Cajamarca",
    "distrito": "Jesus"
  },
  {
    "ubigeo": "060107",
    "departamento": "Cajamarca",
    "provincia": "Cajamarca",
    "distrito": "Llacanora"
  },
  {
    "ubigeo": "060108",
    "departamento": "Cajamarca",
    "provincia": "Cajamarca",
    "distrito": "Los Baños del Inca"
  },
  {
    "ubigeo": "060109",
    "departamento": "Cajamarca",
    "provincia": "Cajamarca",
    "distrito": "Magdalena"
  },
  {
    "ubigeo": "060110",
    "departamento": "Cajamarca",
    "provincia": "Cajamarca",
    "distrito": "Matara"
  },
  {
    "ubigeo": "060111",
    "departamento": "Cajamarca",
    "provincia": "Cajamarca",
    "distrito": "Namora"
  },
  {
    "ubigeo": "060112",
    "departamento": "Cajamarca",
    "provincia": "Cajamarca",
    "distrito": "San Juan"
  },
  {
    "ubigeo": "060201",
    "departamento": "Cajamarca",
    "provincia": "Cajabamba",
    "distrito": "Cajabamba"
  },
  {
    "ubigeo": "060202",
    "departamento": "Cajamarca",
    "provincia": "Cajabamba",
    "distrito": "Cachachi"
  },
  {
    "ubigeo": "060203",
    "departamento": "Cajamarca",
    "provincia": "Cajabamba",
    "distrito": "Condebamba"
  },
  {
    "ubigeo": "060204",
    "departamento": "Cajamarca",
    "provincia": "Cajabamba",
    "distrito": "Sitacocha"
  },
  {
    "ubigeo": "060301",
    "departamento": "Cajamarca",
    "provincia": "Celendín",
    "distrito": "Celendín"
  },
  {
    "ubigeo": "060302",
    "departamento": "Cajamarca",
    "provincia": "Celendín",
    "distrito": "Chumuch"
  },
  {
    "ubigeo": "060303",
    "departamento": "Cajamarca",
    "provincia": "Celendín",
    "distrito": "Cortegana"
  },
  {
    "ubigeo": "060304",
    "departamento": "Cajamarca",
    "provincia": "Celendín",
    "distrito": "Huasmin"
  },
  {
    "ubigeo": "060305",
    "departamento": "Cajamarca",
    "provincia": "Celendín",
    "distrito": "Jorge Chávez"
  },
  {
    "ubigeo": "060306",
    "departamento": "Cajamarca",
    "provincia": "Celendín",
    "distrito": "Jose Gálvez"
  },
  {
    "ubigeo": "060307",
    "departamento": "Cajamarca",
    "provincia": "Celendín",
    "distrito": "Miguel Iglesias"
  },
  {
    "ubigeo": "060308",
    "departamento": "Cajamarca",
    "provincia": "Celendín",
    "distrito": "Oxamarca"
  },
  {
    "ubigeo": "060309",
    "departamento": "Cajamarca",
    "provincia": "Celendín",
    "distrito": "Sorochuco"
  },
  {
    "ubigeo": "060310",
    "departamento": "Cajamarca",
    "provincia": "Celendín",
    "distrito": "Sucre"
  },
  {
    "ubigeo": "060311",
    "departamento": "Cajamarca",
    "provincia": "Celendín",
    "distrito": "Utco"
  },
  {
    "ubigeo": "060312",
    "departamento": "Cajamarca",
    "provincia": "Celendín",
    "distrito": "La Libertad de Pallan"
  },
  {
    "ubigeo": "060401",
    "departamento": "Cajamarca",
    "provincia": "Chota",
    "distrito": "Chota"
  },
  {
    "ubigeo": "060402",
    "departamento": "Cajamarca",
    "provincia": "Chota",
    "distrito": "Anguia"
  },
  {
    "ubigeo": "060403",
    "departamento": "Cajamarca",
    "provincia": "Chota",
    "distrito": "Chadin"
  },
  {
    "ubigeo": "060404",
    "departamento": "Cajamarca",
    "provincia": "Chota",
    "distrito": "Chiguirip"
  },
  {
    "ubigeo": "060405",
    "departamento": "Cajamarca",
    "provincia": "Chota",
    "distrito": "Chimban"
  },
  {
    "ubigeo": "060406",
    "departamento": "Cajamarca",
    "provincia": "Chota",
    "distrito": "Choropampa"
  },
  {
    "ubigeo": "060407",
    "departamento": "Cajamarca",
    "provincia": "Chota",
    "distrito": "Cochabamba"
  },
  {
    "ubigeo": "060408",
    "departamento": "Cajamarca",
    "provincia": "Chota",
    "distrito": "Conchan"
  },
  {
    "ubigeo": "060409",
    "departamento": "Cajamarca",
    "provincia": "Chota",
    "distrito": "Huambos"
  },
  {
    "ubigeo": "060410",
    "departamento": "Cajamarca",
    "provincia": "Chota",
    "distrito": "Lajas"
  },
  {
    "ubigeo": "060411",
    "departamento": "Cajamarca",
    "provincia": "Chota",
    "distrito": "Llama"
  },
  {
    "ubigeo": "060412",
    "departamento": "Cajamarca",
    "provincia": "Chota",
    "distrito": "Miracosta"
  },
  {
    "ubigeo": "060413",
    "departamento": "Cajamarca",
    "provincia": "Chota",
    "distrito": "Paccha"
  },
  {
    "ubigeo": "060414",
    "departamento": "Cajamarca",
    "provincia": "Chota",
    "distrito": "Pion"
  },
  {
    "ubigeo": "060415",
    "departamento": "Cajamarca",
    "provincia": "Chota",
    "distrito": "Querocoto"
  },
  {
    "ubigeo": "060416",
    "departamento": "Cajamarca",
    "provincia": "Chota",
    "distrito": "San Juan de Licupis"
  },
  {
    "ubigeo": "060417",
    "departamento": "Cajamarca",
    "provincia": "Chota",
    "distrito": "Tacabamba"
  },
  {
    "ubigeo": "060418",
    "departamento": "Cajamarca",
    "provincia": "Chota",
    "distrito": "Tocmoche"
  },
  {
    "ubigeo": "060419",
    "departamento": "Cajamarca",
    "provincia": "Chota",
    "distrito": "Chalamarca"
  },
  {
    "ubigeo": "060501",
    "departamento": "Cajamarca",
    "provincia": "Contumaza",
    "distrito": "Contumaza"
  },
  {
    "ubigeo": "060502",
    "departamento": "Cajamarca",
    "provincia": "Contumaza",
    "distrito": "Chilete"
  },
  {
    "ubigeo": "060503",
    "departamento": "Cajamarca",
    "provincia": "Contumaza",
    "distrito": "Cupisnique"
  },
  {
    "ubigeo": "060504",
    "departamento": "Cajamarca",
    "provincia": "Contumaza",
    "distrito": "Guzmango"
  },
  {
    "ubigeo": "060505",
    "departamento": "Cajamarca",
    "provincia": "Contumaza",
    "distrito": "San Benito"
  },
  {
    "ubigeo": "060506",
    "departamento": "Cajamarca",
    "provincia": "Contumaza",
    "distrito": "Santa Cruz de Toled"
  },
  {
    "ubigeo": "060507",
    "departamento": "Cajamarca",
    "provincia": "Contumaza",
    "distrito": "Tantarica"
  },
  {
    "ubigeo": "060508",
    "departamento": "Cajamarca",
    "provincia": "Contumaza",
    "distrito": "Yonan"
  },
  {
    "ubigeo": "060601",
    "departamento": "Cajamarca",
    "provincia": "Cutervo",
    "distrito": "Cutervo"
  },
  {
    "ubigeo": "060602",
    "departamento": "Cajamarca",
    "provincia": "Cutervo",
    "distrito": "Callayuc"
  },
  {
    "ubigeo": "060603",
    "departamento": "Cajamarca",
    "provincia": "Cutervo",
    "distrito": "Choros"
  },
  {
    "ubigeo": "060604",
    "departamento": "Cajamarca",
    "provincia": "Cutervo",
    "distrito": "Cujillo"
  },
  {
    "ubigeo": "060605",
    "departamento": "Cajamarca",
    "provincia": "Cutervo",
    "distrito": "La Ramada"
  },
  {
    "ubigeo": "060606",
    "departamento": "Cajamarca",
    "provincia": "Cutervo",
    "distrito": "Pimpingos"
  },
  {
    "ubigeo": "060607",
    "departamento": "Cajamarca",
    "provincia": "Cutervo",
    "distrito": "Querocotillo"
  },
  {
    "ubigeo": "060608",
    "departamento": "Cajamarca",
    "provincia": "Cutervo",
    "distrito": "San Andrés de Cutervo"
  },
  {
    "ubigeo": "060609",
    "departamento": "Cajamarca",
    "provincia": "Cutervo",
    "distrito": "San Juan de Cutervo"
  },
  {
    "ubigeo": "060610",
    "departamento": "Cajamarca",
    "provincia": "Cutervo",
    "distrito": "San Luis de Lucma"
  },
  {
    "ubigeo": "060611",
    "departamento": "Cajamarca",
    "provincia": "Cutervo",
    "distrito": "Santa Cruz"
  },
  {
    "ubigeo": "060612",
    "departamento": "Cajamarca",
    "provincia": "Cutervo",
    "distrito": "Santo Domingo de La Capilla"
  },
  {
    "ubigeo": "060613",
    "departamento": "Cajamarca",
    "provincia": "Cutervo",
    "distrito": "Santo Tomas"
  },
  {
    "ubigeo": "060614",
    "departamento": "Cajamarca",
    "provincia": "Cutervo",
    "distrito": "Socota"
  },
  {
    "ubigeo": "060615",
    "departamento": "Cajamarca",
    "provincia": "Cutervo",
    "distrito": "Toribio Casanova"
  },
  {
    "ubigeo": "060701",
    "departamento": "Cajamarca",
    "provincia": "Hualgayoc",
    "distrito": "Bambamarca"
  },
  {
    "ubigeo": "060702",
    "departamento": "Cajamarca",
    "provincia": "Hualgayoc",
    "distrito": "Chugur"
  },
  {
    "ubigeo": "060703",
    "departamento": "Cajamarca",
    "provincia": "Hualgayoc",
    "distrito": "Hualgayoc"
  },
  {
    "ubigeo": "060801",
    "departamento": "Cajamarca",
    "provincia": "Jaén",
    "distrito": "Jaén"
  },
  {
    "ubigeo": "060802",
    "departamento": "Cajamarca",
    "provincia": "Jaén",
    "distrito": "Bellavista"
  },
  {
    "ubigeo": "060803",
    "departamento": "Cajamarca",
    "provincia": "Jaén",
    "distrito": "Chontali"
  },
  {
    "ubigeo": "060804",
    "departamento": "Cajamarca",
    "provincia": "Jaén",
    "distrito": "Colasay"
  },
  {
    "ubigeo": "060805",
    "departamento": "Cajamarca",
    "provincia": "Jaén",
    "distrito": "Huabal"
  },
  {
    "ubigeo": "060806",
    "departamento": "Cajamarca",
    "provincia": "Jaén",
    "distrito": "Las Pirias"
  },
  {
    "ubigeo": "060807",
    "departamento": "Cajamarca",
    "provincia": "Jaén",
    "distrito": "Pomahuaca"
  },
  {
    "ubigeo": "060808",
    "departamento": "Cajamarca",
    "provincia": "Jaén",
    "distrito": "Pucara"
  },
  {
    "ubigeo": "060809",
    "departamento": "Cajamarca",
    "provincia": "Jaén",
    "distrito": "Sallique"
  },
  {
    "ubigeo": "060810",
    "departamento": "Cajamarca",
    "provincia": "Jaén",
    "distrito": "San Felipe"
  },
  {
    "ubigeo": "060811",
    "departamento": "Cajamarca",
    "provincia": "Jaén",
    "distrito": "San Jose del Alto"
  },
  {
    "ubigeo": "060812",
    "departamento": "Cajamarca",
    "provincia": "Jaén",
    "distrito": "Santa Rosa"
  },
  {
    "ubigeo": "060901",
    "departamento": "Cajamarca",
    "provincia": "San Ignacio",
    "distrito": "San Ignacio"
  },
  {
    "ubigeo": "060902",
    "departamento": "Cajamarca",
    "provincia": "San Ignacio",
    "distrito": "Chirinos"
  },
  {
    "ubigeo": "060903",
    "departamento": "Cajamarca",
    "provincia": "San Ignacio",
    "distrito": "Huarango"
  },
  {
    "ubigeo": "060904",
    "departamento": "Cajamarca",
    "provincia": "San Ignacio",
    "distrito": "La Coipa"
  },
  {
    "ubigeo": "060905",
    "departamento": "Cajamarca",
    "provincia": "San Ignacio",
    "distrito": "Namballe"
  },
  {
    "ubigeo": "060906",
    "departamento": "Cajamarca",
    "provincia": "San Ignacio",
    "distrito": "San Jose de Lourdes"
  },
  {
    "ubigeo": "060907",
    "departamento": "Cajamarca",
    "provincia": "San Ignacio",
    "distrito": "Tabaconas"
  },
  {
    "ubigeo": "061001",
    "departamento": "Cajamarca",
    "provincia": "San Marcos",
    "distrito": "Pedro Gálvez"
  },
  {
    "ubigeo": "061002",
    "departamento": "Cajamarca",
    "provincia": "San Marcos",
    "distrito": "Chancay"
  },
  {
    "ubigeo": "061003",
    "departamento": "Cajamarca",
    "provincia": "San Marcos",
    "distrito": "Eduardo Villanueva"
  },
  {
    "ubigeo": "061004",
    "departamento": "Cajamarca",
    "provincia": "San Marcos",
    "distrito": "Gregorio Pita"
  },
  {
    "ubigeo": "061005",
    "departamento": "Cajamarca",
    "provincia": "San Marcos",
    "distrito": "Ichocan"
  },
  {
    "ubigeo": "061006",
    "departamento": "Cajamarca",
    "provincia": "San Marcos",
    "distrito": "Jose Manuel Quiroz"
  },
  {
    "ubigeo": "061007",
    "departamento": "Cajamarca",
    "provincia": "San Marcos",
    "distrito": "Jose Sabogal"
  },
  {
    "ubigeo": "061101",
    "departamento": "Cajamarca",
    "provincia": "San Miguel",
    "distrito": "San Miguel"
  },
  {
    "ubigeo": "061102",
    "departamento": "Cajamarca",
    "provincia": "San Miguel",
    "distrito": "Bolivar"
  },
  {
    "ubigeo": "061103",
    "departamento": "Cajamarca",
    "provincia": "San Miguel",
    "distrito": "Calquis"
  },
  {
    "ubigeo": "061104",
    "departamento": "Cajamarca",
    "provincia": "San Miguel",
    "distrito": "Catilluc"
  },
  {
    "ubigeo": "061105",
    "departamento": "Cajamarca",
    "provincia": "San Miguel",
    "distrito": "El Prado"
  },
  {
    "ubigeo": "061106",
    "departamento": "Cajamarca",
    "provincia": "San Miguel",
    "distrito": "La Florida"
  },
  {
    "ubigeo": "061107",
    "departamento": "Cajamarca",
    "provincia": "San Miguel",
    "distrito": "Llapa"
  },
  {
    "ubigeo": "061108",
    "departamento": "Cajamarca",
    "provincia": "San Miguel",
    "distrito": "Nanchoc"
  },
  {
    "ubigeo": "061109",
    "departamento": "Cajamarca",
    "provincia": "San Miguel",
    "distrito": "Niepos"
  },
  {
    "ubigeo": "061110",
    "departamento": "Cajamarca",
    "provincia": "San Miguel",
    "distrito": "San Gregorio"
  },
  {
    "ubigeo": "061111",
    "departamento": "Cajamarca",
    "provincia": "San Miguel",
    "distrito": "San Silvestre de Cochan"
  },
  {
    "ubigeo": "061112",
    "departamento": "Cajamarca",
    "provincia": "San Miguel",
    "distrito": "Tongod"
  },
  {
    "ubigeo": "061113",
    "departamento": "Cajamarca",
    "provincia": "San Miguel",
    "distrito": "Union Agua Blanca"
  },
  {
    "ubigeo": "061201",
    "departamento": "Cajamarca",
    "provincia": "San Pablo",
    "distrito": "San Pablo"
  },
  {
    "ubigeo": "061202",
    "departamento": "Cajamarca",
    "provincia": "San Pablo",
    "distrito": "San Bernardino"
  },
  {
    "ubigeo": "061203",
    "departamento": "Cajamarca",
    "provincia": "San Pablo",
    "distrito": "San Luis"
  },
  {
    "ubigeo": "061204",
    "departamento": "Cajamarca",
    "provincia": "San Pablo",
    "distrito": "Tumbaden"
  },
  {
    "ubigeo": "061301",
    "departamento": "Cajamarca",
    "provincia": "Santa Cruz",
    "distrito": "Santa Cruz"
  },
  {
    "ubigeo": "061302",
    "departamento": "Cajamarca",
    "provincia": "Santa Cruz",
    "distrito": "Andabamba"
  },
  {
    "ubigeo": "061303",
    "departamento": "Cajamarca",
    "provincia": "Santa Cruz",
    "distrito": "Catache"
  },
  {
    "ubigeo": "061304",
    "departamento": "Cajamarca",
    "provincia": "Santa Cruz",
    "distrito": "Chancaybaños"
  },
  {
    "ubigeo": "061305",
    "departamento": "Cajamarca",
    "provincia": "Santa Cruz",
    "distrito": "La Esperanza"
  },
  {
    "ubigeo": "061306",
    "departamento": "Cajamarca",
    "provincia": "Santa Cruz",
    "distrito": "Ninabamba"
  },
  {
    "ubigeo": "061307",
    "departamento": "Cajamarca",
    "provincia": "Santa Cruz",
    "distrito": "Pulan"
  },
  {
    "ubigeo": "061308",
    "departamento": "Cajamarca",
    "provincia": "Santa Cruz",
    "distrito": "Saucepampa"
  },
  {
    "ubigeo": "061309",
    "departamento": "Cajamarca",
    "provincia": "Santa Cruz",
    "distrito": "Sexi"
  },
  {
    "ubigeo": "061310",
    "departamento": "Cajamarca",
    "provincia": "Santa Cruz",
    "distrito": "Uticyacu"
  },
  {
    "ubigeo": "061311",
    "departamento": "Cajamarca",
    "provincia": "Santa Cruz",
    "distrito": "Yauyucan"
  },
  {
    "ubigeo": "070101",
    "departamento": "Callao",
    "provincia": "Callao",
    "distrito": "Callao"
  },
  {
    "ubigeo": "070102",
    "departamento": "Callao",
    "provincia": "Callao",
    "distrito": "Bellavista"
  },
  {
    "ubigeo": "070103",
    "departamento": "Callao",
    "provincia": "Callao",
    "distrito": "Carmen de La Legua"
  },
  {
    "ubigeo": "070104",
    "departamento": "Callao",
    "provincia": "Callao",
    "distrito": "La Perla"
  },
  {
    "ubigeo": "070105",
    "departamento": "Callao",
    "provincia": "Callao",
    "distrito": "La Punta"
  },
  {
    "ubigeo": "070106",
    "departamento": "Callao",
    "provincia": "Callao",
    "distrito": "Ventanilla"
  },
  {
    "ubigeo": "070107",
    "departamento": "Callao",
    "provincia": "Callao",
    "distrito": "Mi Perú"
  },
  {
    "ubigeo": "080101",
    "departamento": "Cusco",
    "provincia": "Cusco",
    "distrito": "Cusco"
  },
  {
    "ubigeo": "080102",
    "departamento": "Cusco",
    "provincia": "Cusco",
    "distrito": "Ccorca"
  },
  {
    "ubigeo": "080103",
    "departamento": "Cusco",
    "provincia": "Cusco",
    "distrito": "Poroy"
  },
  {
    "ubigeo": "080104",
    "departamento": "Cusco",
    "provincia": "Cusco",
    "distrito": "San Jerónimo"
  },
  {
    "ubigeo": "080105",
    "departamento": "Cusco",
    "provincia": "Cusco",
    "distrito": "San Sebastian"
  },
  {
    "ubigeo": "080106",
    "departamento": "Cusco",
    "provincia": "Cusco",
    "distrito": "Santiago"
  },
  {
    "ubigeo": "080107",
    "departamento": "Cusco",
    "provincia": "Cusco",
    "distrito": "Saylla"
  },
  {
    "ubigeo": "080108",
    "departamento": "Cusco",
    "provincia": "Cusco",
    "distrito": "Wanchaq"
  },
  {
    "ubigeo": "080201",
    "departamento": "Cusco",
    "provincia": "Acomayo",
    "distrito": "Acomayo"
  },
  {
    "ubigeo": "080202",
    "departamento": "Cusco",
    "provincia": "Acomayo",
    "distrito": "Acopia"
  },
  {
    "ubigeo": "080203",
    "departamento": "Cusco",
    "provincia": "Acomayo",
    "distrito": "Acos"
  },
  {
    "ubigeo": "080204",
    "departamento": "Cusco",
    "provincia": "Acomayo",
    "distrito": "Mosoc Llacta"
  },
  {
    "ubigeo": "080205",
    "departamento": "Cusco",
    "provincia": "Acomayo",
    "distrito": "Pomacanchi"
  },
  {
    "ubigeo": "080206",
    "departamento": "Cusco",
    "provincia": "Acomayo",
    "distrito": "Rondocan"
  },
  {
    "ubigeo": "080207",
    "departamento": "Cusco",
    "provincia": "Acomayo",
    "distrito": "Sangarara"
  },
  {
    "ubigeo": "080301",
    "departamento": "Cusco",
    "provincia": "Anta",
    "distrito": "Anta"
  },
  {
    "ubigeo": "080302",
    "departamento": "Cusco",
    "provincia": "Anta",
    "distrito": "Ancahuasi"
  },
  {
    "ubigeo": "080303",
    "departamento": "Cusco",
    "provincia": "Anta",
    "distrito": "Cachimayo"
  },
  {
    "ubigeo": "080304",
    "departamento": "Cusco",
    "provincia": "Anta",
    "distrito": "Chinchaypujio"
  },
  {
    "ubigeo": "080305",
    "departamento": "Cusco",
    "provincia": "Anta",
    "distrito": "Huarocondo"
  },
  {
    "ubigeo": "080306",
    "departamento": "Cusco",
    "provincia": "Anta",
    "distrito": "Limatambo"
  },
  {
    "ubigeo": "080307",
    "departamento": "Cusco",
    "provincia": "Anta",
    "distrito": "Mollepata"
  },
  {
    "ubigeo": "080308",
    "departamento": "Cusco",
    "provincia": "Anta",
    "distrito": "Pucyura"
  },
  {
    "ubigeo": "080309",
    "departamento": "Cusco",
    "provincia": "Anta",
    "distrito": "Zurite"
  },
  {
    "ubigeo": "080401",
    "departamento": "Cusco",
    "provincia": "Calca",
    "distrito": "Calca"
  },
  {
    "ubigeo": "080402",
    "departamento": "Cusco",
    "provincia": "Calca",
    "distrito": "Coya"
  },
  {
    "ubigeo": "080403",
    "departamento": "Cusco",
    "provincia": "Calca",
    "distrito": "Lamay"
  },
  {
    "ubigeo": "080404",
    "departamento": "Cusco",
    "provincia": "Calca",
    "distrito": "Lares"
  },
  {
    "ubigeo": "080405",
    "departamento": "Cusco",
    "provincia": "Calca",
    "distrito": "Pisac"
  },
  {
    "ubigeo": "080406",
    "departamento": "Cusco",
    "provincia": "Calca",
    "distrito": "San Salvador"
  },
  {
    "ubigeo": "080407",
    "departamento": "Cusco",
    "provincia": "Calca",
    "distrito": "Taray"
  },
  {
    "ubigeo": "080408",
    "departamento": "Cusco",
    "provincia": "Calca",
    "distrito": "Yanatile"
  },
  {
    "ubigeo": "080501",
    "departamento": "Cusco",
    "provincia": "Canas",
    "distrito": "Yanaoca"
  },
  {
    "ubigeo": "080502",
    "departamento": "Cusco",
    "provincia": "Canas",
    "distrito": "Checca"
  },
  {
    "ubigeo": "080503",
    "departamento": "Cusco",
    "provincia": "Canas",
    "distrito": "Kunturkanki"
  },
  {
    "ubigeo": "080504",
    "departamento": "Cusco",
    "provincia": "Canas",
    "distrito": "Langui"
  },
  {
    "ubigeo": "080505",
    "departamento": "Cusco",
    "provincia": "Canas",
    "distrito": "Layo"
  },
  {
    "ubigeo": "080506",
    "departamento": "Cusco",
    "provincia": "Canas",
    "distrito": "Pampamarca"
  },
  {
    "ubigeo": "080507",
    "departamento": "Cusco",
    "provincia": "Canas",
    "distrito": "Quehue"
  },
  {
    "ubigeo": "080508",
    "departamento": "Cusco",
    "provincia": "Canas",
    "distrito": "Tupac Amaru"
  },
  {
    "ubigeo": "080601",
    "departamento": "Cusco",
    "provincia": "Canchis",
    "distrito": "Sicuani"
  },
  {
    "ubigeo": "080602",
    "departamento": "Cusco",
    "provincia": "Canchis",
    "distrito": "Checacupe"
  },
  {
    "ubigeo": "080603",
    "departamento": "Cusco",
    "provincia": "Canchis",
    "distrito": "Combapata"
  },
  {
    "ubigeo": "080604",
    "departamento": "Cusco",
    "provincia": "Canchis",
    "distrito": "Marangani"
  },
  {
    "ubigeo": "080605",
    "departamento": "Cusco",
    "provincia": "Canchis",
    "distrito": "Pitumarca"
  },
  {
    "ubigeo": "080606",
    "departamento": "Cusco",
    "provincia": "Canchis",
    "distrito": "San Pablo"
  },
  {
    "ubigeo": "080607",
    "departamento": "Cusco",
    "provincia": "Canchis",
    "distrito": "San Pedro"
  },
  {
    "ubigeo": "080608",
    "departamento": "Cusco",
    "provincia": "Canchis",
    "distrito": "Tinta"
  },
  {
    "ubigeo": "080701",
    "departamento": "Cusco",
    "provincia": "Chumbivilcas",
    "distrito": "Santo Tomas"
  },
  {
    "ubigeo": "080702",
    "departamento": "Cusco",
    "provincia": "Chumbivilcas",
    "distrito": "Capacmarca"
  },
  {
    "ubigeo": "080703",
    "departamento": "Cusco",
    "provincia": "Chumbivilcas",
    "distrito": "Chamaca"
  },
  {
    "ubigeo": "080704",
    "departamento": "Cusco",
    "provincia": "Chumbivilcas",
    "distrito": "Colquemarca"
  },
  {
    "ubigeo": "080705",
    "departamento": "Cusco",
    "provincia": "Chumbivilcas",
    "distrito": "Livitaca"
  },
  {
    "ubigeo": "080706",
    "departamento": "Cusco",
    "provincia": "Chumbivilcas",
    "distrito": "Llusco"
  },
  {
    "ubigeo": "080707",
    "departamento": "Cusco",
    "provincia": "Chumbivilcas",
    "distrito": "Quiñota"
  },
  {
    "ubigeo": "080708",
    "departamento": "Cusco",
    "provincia": "Chumbivilcas",
    "distrito": "Velille"
  },
  {
    "ubigeo": "080801",
    "departamento": "Cusco",
    "provincia": "Espinar",
    "distrito": "Espinar"
  },
  {
    "ubigeo": "080802",
    "departamento": "Cusco",
    "provincia": "Espinar",
    "distrito": "Condoroma"
  },
  {
    "ubigeo": "080803",
    "departamento": "Cusco",
    "provincia": "Espinar",
    "distrito": "Coporaque"
  },
  {
    "ubigeo": "080804",
    "departamento": "Cusco",
    "provincia": "Espinar",
    "distrito": "Ocoruro"
  },
  {
    "ubigeo": "080805",
    "departamento": "Cusco",
    "provincia": "Espinar",
    "distrito": "Pallpata"
  },
  {
    "ubigeo": "080806",
    "departamento": "Cusco",
    "provincia": "Espinar",
    "distrito": "Pichigua"
  },
  {
    "ubigeo": "080807",
    "departamento": "Cusco",
    "provincia": "Espinar",
    "distrito": "Suyckutambo"
  },
  {
    "ubigeo": "080808",
    "departamento": "Cusco",
    "provincia": "Espinar",
    "distrito": "Alto Pichigua"
  },
  {
    "ubigeo": "080901",
    "departamento": "Cusco",
    "provincia": "La Convención",
    "distrito": "Santa Ana"
  },
  {
    "ubigeo": "080902",
    "departamento": "Cusco",
    "provincia": "La Convención",
    "distrito": "Echarate"
  },
  {
    "ubigeo": "080903",
    "departamento": "Cusco",
    "provincia": "La Convención",
    "distrito": "Huayopata"
  },
  {
    "ubigeo": "080904",
    "departamento": "Cusco",
    "provincia": "La Convención",
    "distrito": "Maranura"
  },
  {
    "ubigeo": "080905",
    "departamento": "Cusco",
    "provincia": "La Convención",
    "distrito": "Ocobamba"
  },
  {
    "ubigeo": "080906",
    "departamento": "Cusco",
    "provincia": "La Convención",
    "distrito": "Quellouno"
  },
  {
    "ubigeo": "080907",
    "departamento": "Cusco",
    "provincia": "La Convención",
    "distrito": "Kimbiri"
  },
  {
    "ubigeo": "080908",
    "departamento": "Cusco",
    "provincia": "La Convención",
    "distrito": "Santa Teresa"
  },
  {
    "ubigeo": "080909",
    "departamento": "Cusco",
    "provincia": "La Convención",
    "distrito": "Vilcabamba"
  },
  {
    "ubigeo": "080910",
    "departamento": "Cusco",
    "provincia": "La Convención",
    "distrito": "Pichari"
  },
  {
    "ubigeo": "080911",
    "departamento": "Cusco",
    "provincia": "La Convención",
    "distrito": "Inkawasi"
  },
  {
    "ubigeo": "080912",
    "departamento": "Cusco",
    "provincia": "La Convención",
    "distrito": "Villa Virgen"
  },
  {
    "ubigeo": "080913",
    "departamento": "Cusco",
    "provincia": "La Convención",
    "distrito": "Villa Kintiarina"
  },
  {
    "ubigeo": "080914",
    "departamento": "Cusco",
    "provincia": "La Convención",
    "distrito": "Megantoni"
  },
  {
    "ubigeo": "081001",
    "departamento": "Cusco",
    "provincia": "Paruro",
    "distrito": "Paruro"
  },
  {
    "ubigeo": "081002",
    "departamento": "Cusco",
    "provincia": "Paruro",
    "distrito": "Accha"
  },
  {
    "ubigeo": "081003",
    "departamento": "Cusco",
    "provincia": "Paruro",
    "distrito": "Ccapi"
  },
  {
    "ubigeo": "081004",
    "departamento": "Cusco",
    "provincia": "Paruro",
    "distrito": "Colcha"
  },
  {
    "ubigeo": "081005",
    "departamento": "Cusco",
    "provincia": "Paruro",
    "distrito": "Huanoquite"
  },
  {
    "ubigeo": "081006",
    "departamento": "Cusco",
    "provincia": "Paruro",
    "distrito": "Omacha"
  },
  {
    "ubigeo": "081007",
    "departamento": "Cusco",
    "provincia": "Paruro",
    "distrito": "Paccaritambo"
  },
  {
    "ubigeo": "081008",
    "departamento": "Cusco",
    "provincia": "Paruro",
    "distrito": "Pillpinto"
  },
  {
    "ubigeo": "081009",
    "departamento": "Cusco",
    "provincia": "Paruro",
    "distrito": "Yaurisque"
  },
  {
    "ubigeo": "081101",
    "departamento": "Cusco",
    "provincia": "Paucartambo",
    "distrito": "Paucartambo"
  },
  {
    "ubigeo": "081102",
    "departamento": "Cusco",
    "provincia": "Paucartambo",
    "distrito": "Caicay"
  },
  {
    "ubigeo": "081103",
    "departamento": "Cusco",
    "provincia": "Paucartambo",
    "distrito": "Challabamba"
  },
  {
    "ubigeo": "081104",
    "departamento": "Cusco",
    "provincia": "Paucartambo",
    "distrito": "Colquepata"
  },
  {
    "ubigeo": "081105",
    "departamento": "Cusco",
    "provincia": "Paucartambo",
    "distrito": "Huancarani"
  },
  {
    "ubigeo": "081106",
    "departamento": "Cusco",
    "provincia": "Paucartambo",
    "distrito": "Kosñipata"
  },
  {
    "ubigeo": "081201",
    "departamento": "Cusco",
    "provincia": "Quispicanchi",
    "distrito": "Urcos"
  },
  {
    "ubigeo": "081202",
    "departamento": "Cusco",
    "provincia": "Quispicanchi",
    "distrito": "Andahuaylillas"
  },
  {
    "ubigeo": "081203",
    "departamento": "Cusco",
    "provincia": "Quispicanchi",
    "distrito": "Camanti"
  },
  {
    "ubigeo": "081204",
    "departamento": "Cusco",
    "provincia": "Quispicanchi",
    "distrito": "Ccarhuayo"
  },
  {
    "ubigeo": "081205",
    "departamento": "Cusco",
    "provincia": "Quispicanchi",
    "distrito": "Ccatca"
  },
  {
    "ubigeo": "081206",
    "departamento": "Cusco",
    "provincia": "Quispicanchi",
    "distrito": "Cusipata"
  },
  {
    "ubigeo": "081207",
    "departamento": "Cusco",
    "provincia": "Quispicanchi",
    "distrito": "Huaro"
  },
  {
    "ubigeo": "081208",
    "departamento": "Cusco",
    "provincia": "Quispicanchi",
    "distrito": "Lucre"
  },
  {
    "ubigeo": "081209",
    "departamento": "Cusco",
    "provincia": "Quispicanchi",
    "distrito": "Marcapata"
  },
  {
    "ubigeo": "081210",
    "departamento": "Cusco",
    "provincia": "Quispicanchi",
    "distrito": "Ocongate"
  },
  {
    "ubigeo": "081211",
    "departamento": "Cusco",
    "provincia": "Quispicanchi",
    "distrito": "Oropesa"
  },
  {
    "ubigeo": "081212",
    "departamento": "Cusco",
    "provincia": "Quispicanchi",
    "distrito": "Quiquijana"
  },
  {
    "ubigeo": "081301",
    "departamento": "Cusco",
    "provincia": "Urubamba",
    "distrito": "Urubamba"
  },
  {
    "ubigeo": "081302",
    "departamento": "Cusco",
    "provincia": "Urubamba",
    "distrito": "Chinchero"
  },
  {
    "ubigeo": "081303",
    "departamento": "Cusco",
    "provincia": "Urubamba",
    "distrito": "Huayllabamba"
  },
  {
    "ubigeo": "081304",
    "departamento": "Cusco",
    "provincia": "Urubamba",
    "distrito": "Machupicchu"
  },
  {
    "ubigeo": "081305",
    "departamento": "Cusco",
    "provincia": "Urubamba",
    "distrito": "Maras"
  },
  {
    "ubigeo": "081306",
    "departamento": "Cusco",
    "provincia": "Urubamba",
    "distrito": "Ollantaytambo"
  },
  {
    "ubigeo": "081307",
    "departamento": "Cusco",
    "provincia": "Urubamba",
    "distrito": "Yucay"
  },
  {
    "ubigeo": "090101",
    "departamento": "Huancavelica",
    "provincia": "Huancavelica",
    "distrito": "Huancavelica"
  },
  {
    "ubigeo": "090102",
    "departamento": "Huancavelica",
    "provincia": "Huancavelica",
    "distrito": "Acobambilla"
  },
  {
    "ubigeo": "090103",
    "departamento": "Huancavelica",
    "provincia": "Huancavelica",
    "distrito": "Acoria"
  },
  {
    "ubigeo": "090104",
    "departamento": "Huancavelica",
    "provincia": "Huancavelica",
    "distrito": "Conayca"
  },
  {
    "ubigeo": "090105",
    "departamento": "Huancavelica",
    "provincia": "Huancavelica",
    "distrito": "Cuenca"
  },
  {
    "ubigeo": "090106",
    "departamento": "Huancavelica",
    "provincia": "Huancavelica",
    "distrito": "Huachocolpa"
  },
  {
    "ubigeo": "090107",
    "departamento": "Huancavelica",
    "provincia": "Huancavelica",
    "distrito": "Huayllahuara"
  },
  {
    "ubigeo": "090108",
    "departamento": "Huancavelica",
    "provincia": "Huancavelica",
    "distrito": "Izcuchaca"
  },
  {
    "ubigeo": "090109",
    "departamento": "Huancavelica",
    "provincia": "Huancavelica",
    "distrito": "Laria"
  },
  {
    "ubigeo": "090110",
    "departamento": "Huancavelica",
    "provincia": "Huancavelica",
    "distrito": "Manta"
  },
  {
    "ubigeo": "090111",
    "departamento": "Huancavelica",
    "provincia": "Huancavelica",
    "distrito": "Mariscal Cáceres"
  },
  {
    "ubigeo": "090112",
    "departamento": "Huancavelica",
    "provincia": "Huancavelica",
    "distrito": "Moya"
  },
  {
    "ubigeo": "090113",
    "departamento": "Huancavelica",
    "provincia": "Huancavelica",
    "distrito": "Nuevo Occoro"
  },
  {
    "ubigeo": "090114",
    "departamento": "Huancavelica",
    "provincia": "Huancavelica",
    "distrito": "Palca"
  },
  {
    "ubigeo": "090115",
    "departamento": "Huancavelica",
    "provincia": "Huancavelica",
    "distrito": "Pilchaca"
  },
  {
    "ubigeo": "090116",
    "departamento": "Huancavelica",
    "provincia": "Huancavelica",
    "distrito": "Vilca"
  },
  {
    "ubigeo": "090117",
    "departamento": "Huancavelica",
    "provincia": "Huancavelica",
    "distrito": "Yauli"
  },
  {
    "ubigeo": "090118",
    "departamento": "Huancavelica",
    "provincia": "Huancavelica",
    "distrito": "Ascensión"
  },
  {
    "ubigeo": "090119",
    "departamento": "Huancavelica",
    "provincia": "Huancavelica",
    "distrito": "Huando"
  },
  {
    "ubigeo": "090201",
    "departamento": "Huancavelica",
    "provincia": "Acobamba",
    "distrito": "Acobamba"
  },
  {
    "ubigeo": "090202",
    "departamento": "Huancavelica",
    "provincia": "Acobamba",
    "distrito": "Andabamba"
  },
  {
    "ubigeo": "090203",
    "departamento": "Huancavelica",
    "provincia": "Acobamba",
    "distrito": "Anta"
  },
  {
    "ubigeo": "090204",
    "departamento": "Huancavelica",
    "provincia": "Acobamba",
    "distrito": "Caja"
  },
  {
    "ubigeo": "090205",
    "departamento": "Huancavelica",
    "provincia": "Acobamba",
    "distrito": "Marcas"
  },
  {
    "ubigeo": "090206",
    "departamento": "Huancavelica",
    "provincia": "Acobamba",
    "distrito": "Paucara"
  },
  {
    "ubigeo": "090207",
    "departamento": "Huancavelica",
    "provincia": "Acobamba",
    "distrito": "Pomacocha"
  },
  {
    "ubigeo": "090208",
    "departamento": "Huancavelica",
    "provincia": "Acobamba",
    "distrito": "Rosario"
  },
  {
    "ubigeo": "090301",
    "departamento": "Huancavelica",
    "provincia": "Angaraes",
    "distrito": "Lircay"
  },
  {
    "ubigeo": "090302",
    "departamento": "Huancavelica",
    "provincia": "Angaraes",
    "distrito": "Anchonga"
  },
  {
    "ubigeo": "090303",
    "departamento": "Huancavelica",
    "provincia": "Angaraes",
    "distrito": "Callanmarca"
  },
  {
    "ubigeo": "090304",
    "departamento": "Huancavelica",
    "provincia": "Angaraes",
    "distrito": "Ccochaccasa"
  },
  {
    "ubigeo": "090305",
    "departamento": "Huancavelica",
    "provincia": "Angaraes",
    "distrito": "Chincho"
  },
  {
    "ubigeo": "090306",
    "departamento": "Huancavelica",
    "provincia": "Angaraes",
    "distrito": "Congalla"
  },
  {
    "ubigeo": "090307",
    "departamento": "Huancavelica",
    "provincia": "Angaraes",
    "distrito": "Huanca-Huanca"
  },
  {
    "ubigeo": "090308",
    "departamento": "Huancavelica",
    "provincia": "Angaraes",
    "distrito": "Huayllay Grande"
  },
  {
    "ubigeo": "090309",
    "departamento": "Huancavelica",
    "provincia": "Angaraes",
    "distrito": "Julcamarca"
  },
  {
    "ubigeo": "090310",
    "departamento": "Huancavelica",
    "provincia": "Angaraes",
    "distrito": "San Antonio de Antaparco"
  },
  {
    "ubigeo": "090311",
    "departamento": "Huancavelica",
    "provincia": "Angaraes",
    "distrito": "Santo Tomas de Pata"
  },
  {
    "ubigeo": "090312",
    "departamento": "Huancavelica",
    "provincia": "Angaraes",
    "distrito": "Secclla"
  },
  {
    "ubigeo": "090401",
    "departamento": "Huancavelica",
    "provincia": "Castrovirreyna",
    "distrito": "Castrovirreyna"
  },
  {
    "ubigeo": "090402",
    "departamento": "Huancavelica",
    "provincia": "Castrovirreyna",
    "distrito": "Arma"
  },
  {
    "ubigeo": "090403",
    "departamento": "Huancavelica",
    "provincia": "Castrovirreyna",
    "distrito": "Aurahua"
  },
  {
    "ubigeo": "090404",
    "departamento": "Huancavelica",
    "provincia": "Castrovirreyna",
    "distrito": "Capillas"
  },
  {
    "ubigeo": "090405",
    "departamento": "Huancavelica",
    "provincia": "Castrovirreyna",
    "distrito": "Chupamarca"
  },
  {
    "ubigeo": "090406",
    "departamento": "Huancavelica",
    "provincia": "Castrovirreyna",
    "distrito": "Cocas"
  },
  {
    "ubigeo": "090407",
    "departamento": "Huancavelica",
    "provincia": "Castrovirreyna",
    "distrito": "Huachos"
  },
  {
    "ubigeo": "090408",
    "departamento": "Huancavelica",
    "provincia": "Castrovirreyna",
    "distrito": "Huamatambo"
  },
  {
    "ubigeo": "090409",
    "departamento": "Huancavelica",
    "provincia": "Castrovirreyna",
    "distrito": "Mollepampa"
  },
  {
    "ubigeo": "090410",
    "departamento": "Huancavelica",
    "provincia": "Castrovirreyna",
    "distrito": "San Juan"
  },
  {
    "ubigeo": "090411",
    "departamento": "Huancavelica",
    "provincia": "Castrovirreyna",
    "distrito": "Santa Ana"
  },
  {
    "ubigeo": "090412",
    "departamento": "Huancavelica",
    "provincia": "Castrovirreyna",
    "distrito": "Tantara"
  },
  {
    "ubigeo": "090413",
    "departamento": "Huancavelica",
    "provincia": "Castrovirreyna",
    "distrito": "Ticrapo"
  },
  {
    "ubigeo": "090501",
    "departamento": "Huancavelica",
    "provincia": "Churcampa",
    "distrito": "Churcampa"
  },
  {
    "ubigeo": "090502",
    "departamento": "Huancavelica",
    "provincia": "Churcampa",
    "distrito": "Anco"
  },
  {
    "ubigeo": "090503",
    "departamento": "Huancavelica",
    "provincia": "Churcampa",
    "distrito": "Chinchihuasi"
  },
  {
    "ubigeo": "090504",
    "departamento": "Huancavelica",
    "provincia": "Churcampa",
    "distrito": "El Carmen"
  },
  {
    "ubigeo": "090505",
    "departamento": "Huancavelica",
    "provincia": "Churcampa",
    "distrito": "La Merced"
  },
  {
    "ubigeo": "090506",
    "departamento": "Huancavelica",
    "provincia": "Churcampa",
    "distrito": "Locroja"
  },
  {
    "ubigeo": "090507",
    "departamento": "Huancavelica",
    "provincia": "Churcampa",
    "distrito": "Paucarbamba"
  },
  {
    "ubigeo": "090508",
    "departamento": "Huancavelica",
    "provincia": "Churcampa",
    "distrito": "San Miguel de Mayocc"
  },
  {
    "ubigeo": "090509",
    "departamento": "Huancavelica",
    "provincia": "Churcampa",
    "distrito": "San Pedro de Coris"
  },
  {
    "ubigeo": "090510",
    "departamento": "Huancavelica",
    "provincia": "Churcampa",
    "distrito": "Pachamarca"
  },
  {
    "ubigeo": "090511",
    "departamento": "Huancavelica",
    "provincia": "Churcampa",
    "distrito": "Cosme"
  },
  {
    "ubigeo": "090601",
    "departamento": "Huancavelica",
    "provincia": "Huaytara",
    "distrito": "Huaytara"
  },
  {
    "ubigeo": "090602",
    "departamento": "Huancavelica",
    "provincia": "Huaytara",
    "distrito": "Ayavi"
  },
  {
    "ubigeo": "090603",
    "departamento": "Huancavelica",
    "provincia": "Huaytara",
    "distrito": "Córdova"
  },
  {
    "ubigeo": "090604",
    "departamento": "Huancavelica",
    "provincia": "Huaytara",
    "distrito": "Huayacundo Arma"
  },
  {
    "ubigeo": "090605",
    "departamento": "Huancavelica",
    "provincia": "Huaytara",
    "distrito": "Laramarca"
  },
  {
    "ubigeo": "090606",
    "departamento": "Huancavelica",
    "provincia": "Huaytara",
    "distrito": "Ocoyo"
  },
  {
    "ubigeo": "090607",
    "departamento": "Huancavelica",
    "provincia": "Huaytara",
    "distrito": "Pilpichaca"
  },
  {
    "ubigeo": "090608",
    "departamento": "Huancavelica",
    "provincia": "Huaytara",
    "distrito": "Querco"
  },
  {
    "ubigeo": "090609",
    "departamento": "Huancavelica",
    "provincia": "Huaytara",
    "distrito": "Quito-Arma"
  },
  {
    "ubigeo": "090610",
    "departamento": "Huancavelica",
    "provincia": "Huaytara",
    "distrito": "San Antonio de Cusicancha"
  },
  {
    "ubigeo": "090611",
    "departamento": "Huancavelica",
    "provincia": "Huaytara",
    "distrito": "San Francisco de Sangayaico"
  },
  {
    "ubigeo": "090612",
    "departamento": "Huancavelica",
    "provincia": "Huaytara",
    "distrito": "San Isidro"
  },
  {
    "ubigeo": "090613",
    "departamento": "Huancavelica",
    "provincia": "Huaytara",
    "distrito": "Santiago de Chocorvos"
  },
  {
    "ubigeo": "090614",
    "departamento": "Huancavelica",
    "provincia": "Huaytara",
    "distrito": "Santiago de Quirahuara"
  },
  {
    "ubigeo": "090615",
    "departamento": "Huancavelica",
    "provincia": "Huaytara",
    "distrito": "Santo Domingo de Capillas"
  },
  {
    "ubigeo": "090616",
    "departamento": "Huancavelica",
    "provincia": "Huaytara",
    "distrito": "Tambo"
  },
  {
    "ubigeo": "090701",
    "departamento": "Huancavelica",
    "provincia": "Tayacaja",
    "distrito": "Pampas"
  },
  {
    "ubigeo": "090702",
    "departamento": "Huancavelica",
    "provincia": "Tayacaja",
    "distrito": "Acostambo"
  },
  {
    "ubigeo": "090703",
    "departamento": "Huancavelica",
    "provincia": "Tayacaja",
    "distrito": "Acraquia"
  },
  {
    "ubigeo": "090704",
    "departamento": "Huancavelica",
    "provincia": "Tayacaja",
    "distrito": "Ahuaycha"
  },
  {
    "ubigeo": "090705",
    "departamento": "Huancavelica",
    "provincia": "Tayacaja",
    "distrito": "Colcabamba"
  },
  {
    "ubigeo": "090706",
    "departamento": "Huancavelica",
    "provincia": "Tayacaja",
    "distrito": "Daniel Hernández"
  },
  {
    "ubigeo": "090707",
    "departamento": "Huancavelica",
    "provincia": "Tayacaja",
    "distrito": "Huachocolpa"
  },
  {
    "ubigeo": "090709",
    "departamento": "Huancavelica",
    "provincia": "Tayacaja",
    "distrito": "Huaribamba"
  },
  {
    "ubigeo": "090710",
    "departamento": "Huancavelica",
    "provincia": "Tayacaja",
    "distrito": "Ñahuimpuquio"
  },
  {
    "ubigeo": "090711",
    "departamento": "Huancavelica",
    "provincia": "Tayacaja",
    "distrito": "Pazos"
  },
  {
    "ubigeo": "090713",
    "departamento": "Huancavelica",
    "provincia": "Tayacaja",
    "distrito": "Quishuar"
  },
  {
    "ubigeo": "090714",
    "departamento": "Huancavelica",
    "provincia": "Tayacaja",
    "distrito": "Salcabamba"
  },
  {
    "ubigeo": "090715",
    "departamento": "Huancavelica",
    "provincia": "Tayacaja",
    "distrito": "Salcahuasi"
  },
  {
    "ubigeo": "090716",
    "departamento": "Huancavelica",
    "provincia": "Tayacaja",
    "distrito": "San Marcos de Rocchac"
  },
  {
    "ubigeo": "090717",
    "departamento": "Huancavelica",
    "provincia": "Tayacaja",
    "distrito": "Surcubamba"
  },
  {
    "ubigeo": "090718",
    "departamento": "Huancavelica",
    "provincia": "Tayacaja",
    "distrito": "Tintay Puncu"
  },
  {
    "ubigeo": "090719",
    "departamento": "Huancavelica",
    "provincia": "Tayacaja",
    "distrito": "Quichuas"
  },
  {
    "ubigeo": "090720",
    "departamento": "Huancavelica",
    "provincia": "Tayacaja",
    "distrito": "Andaymarca"
  },
  {
    "ubigeo": "090721",
    "departamento": "Huancavelica",
    "provincia": "Tayacaja",
    "distrito": "Roble"
  },
  {
    "ubigeo": "090722",
    "departamento": "Huancavelica",
    "provincia": "Tayacaja",
    "distrito": "Pichos"
  },
  {
    "ubigeo": "090723",
    "departamento": "Huancavelica",
    "provincia": "Tayacaja",
    "distrito": "Santiago de Tucuma"
  },
  {
    "ubigeo": "100101",
    "departamento": "Huanuco",
    "provincia": "Huanuco",
    "distrito": "Huanuco"
  },
  {
    "ubigeo": "100102",
    "departamento": "Huanuco",
    "provincia": "Huanuco",
    "distrito": "Amarilis"
  },
  {
    "ubigeo": "100103",
    "departamento": "Huanuco",
    "provincia": "Huanuco",
    "distrito": "Chinchao"
  },
  {
    "ubigeo": "100104",
    "departamento": "Huanuco",
    "provincia": "Huanuco",
    "distrito": "Churubamba"
  },
  {
    "ubigeo": "100105",
    "departamento": "Huanuco",
    "provincia": "Huanuco",
    "distrito": "Margos"
  },
  {
    "ubigeo": "100106",
    "departamento": "Huanuco",
    "provincia": "Huanuco",
    "distrito": "Quisqui"
  },
  {
    "ubigeo": "100107",
    "departamento": "Huanuco",
    "provincia": "Huanuco",
    "distrito": "San Francisco de Cayran"
  },
  {
    "ubigeo": "100108",
    "departamento": "Huanuco",
    "provincia": "Huanuco",
    "distrito": "San Pedro de Chaulan"
  },
  {
    "ubigeo": "100109",
    "departamento": "Huanuco",
    "provincia": "Huanuco",
    "distrito": "Santa Maria del Valle"
  },
  {
    "ubigeo": "100110",
    "departamento": "Huanuco",
    "provincia": "Huanuco",
    "distrito": "Yarumayo"
  },
  {
    "ubigeo": "100111",
    "departamento": "Huanuco",
    "provincia": "Huanuco",
    "distrito": "Pillco Marca"
  },
  {
    "ubigeo": "100112",
    "departamento": "Huanuco",
    "provincia": "Huanuco",
    "distrito": "Yacus"
  },
  {
    "ubigeo": "100113",
    "departamento": "Huanuco",
    "provincia": "Huanuco",
    "distrito": "San Pablo de Pillao"
  },
  {
    "ubigeo": "100201",
    "departamento": "Huanuco",
    "provincia": "Ambo",
    "distrito": "Ambo"
  },
  {
    "ubigeo": "100202",
    "departamento": "Huanuco",
    "provincia": "Ambo",
    "distrito": "Cayna"
  },
  {
    "ubigeo": "100203",
    "departamento": "Huanuco",
    "provincia": "Ambo",
    "distrito": "Colpas"
  },
  {
    "ubigeo": "100204",
    "departamento": "Huanuco",
    "provincia": "Ambo",
    "distrito": "Conchamarca"
  },
  {
    "ubigeo": "100205",
    "departamento": "Huanuco",
    "provincia": "Ambo",
    "distrito": "Huacar"
  },
  {
    "ubigeo": "100206",
    "departamento": "Huanuco",
    "provincia": "Ambo",
    "distrito": "San Francisco"
  },
  {
    "ubigeo": "100207",
    "departamento": "Huanuco",
    "provincia": "Ambo",
    "distrito": "San Rafael"
  },
  {
    "ubigeo": "100208",
    "departamento": "Huanuco",
    "provincia": "Ambo",
    "distrito": "Tomay Kichwa"
  },
  {
    "ubigeo": "100301",
    "departamento": "Huanuco",
    "provincia": "Dos de Mayo",
    "distrito": "La Union"
  },
  {
    "ubigeo": "100307",
    "departamento": "Huanuco",
    "provincia": "Dos de Mayo",
    "distrito": "Chuquis"
  },
  {
    "ubigeo": "100311",
    "departamento": "Huanuco",
    "provincia": "Dos de Mayo",
    "distrito": "Marías"
  },
  {
    "ubigeo": "100313",
    "departamento": "Huanuco",
    "provincia": "Dos de Mayo",
    "distrito": "Pachas"
  },
  {
    "ubigeo": "100316",
    "departamento": "Huanuco",
    "provincia": "Dos de Mayo",
    "distrito": "Quivilla"
  },
  {
    "ubigeo": "100317",
    "departamento": "Huanuco",
    "provincia": "Dos de Mayo",
    "distrito": "Ripan"
  },
  {
    "ubigeo": "100321",
    "departamento": "Huanuco",
    "provincia": "Dos de Mayo",
    "distrito": "Shunqui"
  },
  {
    "ubigeo": "100322",
    "departamento": "Huanuco",
    "provincia": "Dos de Mayo",
    "distrito": "Sillapata"
  },
  {
    "ubigeo": "100323",
    "departamento": "Huanuco",
    "provincia": "Dos de Mayo",
    "distrito": "Yanas"
  },
  {
    "ubigeo": "100401",
    "departamento": "Huanuco",
    "provincia": "Huacaybamba",
    "distrito": "Huacaybamba"
  },
  {
    "ubigeo": "100402",
    "departamento": "Huanuco",
    "provincia": "Huacaybamba",
    "distrito": "Canchabamba"
  },
  {
    "ubigeo": "100403",
    "departamento": "Huanuco",
    "provincia": "Huacaybamba",
    "distrito": "Cochabamba"
  },
  {
    "ubigeo": "100404",
    "departamento": "Huanuco",
    "provincia": "Huacaybamba",
    "distrito": "Pinra"
  },
  {
    "ubigeo": "100501",
    "departamento": "Huanuco",
    "provincia": "Huamalíes",
    "distrito": "Llata"
  },
  {
    "ubigeo": "100502",
    "departamento": "Huanuco",
    "provincia": "Huamalíes",
    "distrito": "Arancay"
  },
  {
    "ubigeo": "100503",
    "departamento": "Huanuco",
    "provincia": "Huamalíes",
    "distrito": "Chavin de Pariarca"
  },
  {
    "ubigeo": "100504",
    "departamento": "Huanuco",
    "provincia": "Huamalíes",
    "distrito": "Jacas Grande"
  },
  {
    "ubigeo": "100505",
    "departamento": "Huanuco",
    "provincia": "Huamalíes",
    "distrito": "Jircan"
  },
  {
    "ubigeo": "100506",
    "departamento": "Huanuco",
    "provincia": "Huamalíes",
    "distrito": "Miraflores"
  },
  {
    "ubigeo": "100507",
    "departamento": "Huanuco",
    "provincia": "Huamalíes",
    "distrito": "Monzón"
  },
  {
    "ubigeo": "100508",
    "departamento": "Huanuco",
    "provincia": "Huamalíes",
    "distrito": "Punchao"
  },
  {
    "ubigeo": "100509",
    "departamento": "Huanuco",
    "provincia": "Huamalíes",
    "distrito": "Puños"
  },
  {
    "ubigeo": "100510",
    "departamento": "Huanuco",
    "provincia": "Huamalíes",
    "distrito": "Singa"
  },
  {
    "ubigeo": "100511",
    "departamento": "Huanuco",
    "provincia": "Huamalíes",
    "distrito": "Tantamayo"
  },
  {
    "ubigeo": "100601",
    "departamento": "Huanuco",
    "provincia": "Leoncio Prado",
    "distrito": "Rupa-Rupa"
  },
  {
    "ubigeo": "100602",
    "departamento": "Huanuco",
    "provincia": "Leoncio Prado",
    "distrito": "Daniel Alomias Robles"
  },
  {
    "ubigeo": "100603",
    "departamento": "Huanuco",
    "provincia": "Leoncio Prado",
    "distrito": "Hermílio Valdizan"
  },
  {
    "ubigeo": "100604",
    "departamento": "Huanuco",
    "provincia": "Leoncio Prado",
    "distrito": "Jose Crespo y Castillo"
  },
  {
    "ubigeo": "100605",
    "departamento": "Huanuco",
    "provincia": "Leoncio Prado",
    "distrito": "Luyando"
  },
  {
    "ubigeo": "100606",
    "departamento": "Huanuco",
    "provincia": "Leoncio Prado",
    "distrito": "Mariano Damaso Beraun"
  },
  {
    "ubigeo": "100607",
    "departamento": "Huanuco",
    "provincia": "Leoncio Prado",
    "distrito": "Pucayacu"
  },
  {
    "ubigeo": "100608",
    "departamento": "Huanuco",
    "provincia": "Leoncio Prado",
    "distrito": "Castillo Grande"
  },
  {
    "ubigeo": "100609",
    "departamento": "Huanuco",
    "provincia": "Leoncio Prado",
    "distrito": "Pueblo Nuevo"
  },
  {
    "ubigeo": "100610",
    "departamento": "Huanuco",
    "provincia": "Leoncio Prado",
    "distrito": "Santo Domingo de Anda"
  },
  {
    "ubigeo": "100701",
    "departamento": "Huanuco",
    "provincia": "Marañon",
    "distrito": "Huacrachuco"
  },
  {
    "ubigeo": "100702",
    "departamento": "Huanuco",
    "provincia": "Marañon",
    "distrito": "Cholon"
  },
  {
    "ubigeo": "100703",
    "departamento": "Huanuco",
    "provincia": "Marañon",
    "distrito": "San Buenaventura"
  },
  {
    "ubigeo": "100704",
    "departamento": "Huanuco",
    "provincia": "Marañon",
    "distrito": "La Morada"
  },
  {
    "ubigeo": "100705",
    "departamento": "Huanuco",
    "provincia": "Marañon",
    "distrito": "Santa Rosa de Alto Yanajanca"
  },
  {
    "ubigeo": "100801",
    "departamento": "Huanuco",
    "provincia": "Pachitea",
    "distrito": "Panao"
  },
  {
    "ubigeo": "100802",
    "departamento": "Huanuco",
    "provincia": "Pachitea",
    "distrito": "Chaglla"
  },
  {
    "ubigeo": "100803",
    "departamento": "Huanuco",
    "provincia": "Pachitea",
    "distrito": "Molino"
  },
  {
    "ubigeo": "100804",
    "departamento": "Huanuco",
    "provincia": "Pachitea",
    "distrito": "Umari"
  },
  {
    "ubigeo": "100901",
    "departamento": "Huanuco",
    "provincia": "Puerto Inca",
    "distrito": "Puerto Inca"
  },
  {
    "ubigeo": "100902",
    "departamento": "Huanuco",
    "provincia": "Puerto Inca",
    "distrito": "Codo del Pozuzo"
  },
  {
    "ubigeo": "100903",
    "departamento": "Huanuco",
    "provincia": "Puerto Inca",
    "distrito": "Honoria"
  },
  {
    "ubigeo": "100904",
    "departamento": "Huanuco",
    "provincia": "Puerto Inca",
    "distrito": "Tournavista"
  },
  {
    "ubigeo": "100905",
    "departamento": "Huanuco",
    "provincia": "Puerto Inca",
    "distrito": "Yuyapichis"
  },
  {
    "ubigeo": "101001",
    "departamento": "Huanuco",
    "provincia": "Lauricocha",
    "distrito": "Jesus"
  },
  {
    "ubigeo": "101002",
    "departamento": "Huanuco",
    "provincia": "Lauricocha",
    "distrito": "Baños"
  },
  {
    "ubigeo": "101003",
    "departamento": "Huanuco",
    "provincia": "Lauricocha",
    "distrito": "Jivia"
  },
  {
    "ubigeo": "101004",
    "departamento": "Huanuco",
    "provincia": "Lauricocha",
    "distrito": "Queropalca"
  },
  {
    "ubigeo": "101005",
    "departamento": "Huanuco",
    "provincia": "Lauricocha",
    "distrito": "Rondos"
  },
  {
    "ubigeo": "101006",
    "departamento": "Huanuco",
    "provincia": "Lauricocha",
    "distrito": "San Francisco de Asís"
  },
  {
    "ubigeo": "101007",
    "departamento": "Huanuco",
    "provincia": "Lauricocha",
    "distrito": "San Miguel de Cauri"
  },
  {
    "ubigeo": "101101",
    "departamento": "Huanuco",
    "provincia": "Yarowilca",
    "distrito": "Chavinillo"
  },
  {
    "ubigeo": "101102",
    "departamento": "Huanuco",
    "provincia": "Yarowilca",
    "distrito": "Cahuac"
  },
  {
    "ubigeo": "101103",
    "departamento": "Huanuco",
    "provincia": "Yarowilca",
    "distrito": "Chacabamba"
  },
  {
    "ubigeo": "101104",
    "departamento": "Huanuco",
    "provincia": "Yarowilca",
    "distrito": "Aparicio Pomares"
  },
  {
    "ubigeo": "101105",
    "departamento": "Huanuco",
    "provincia": "Yarowilca",
    "distrito": "Jacas Chico"
  },
  {
    "ubigeo": "101106",
    "departamento": "Huanuco",
    "provincia": "Yarowilca",
    "distrito": "Obas"
  },
  {
    "ubigeo": "101107",
    "departamento": "Huanuco",
    "provincia": "Yarowilca",
    "distrito": "Pampamarca"
  },
  {
    "ubigeo": "101108",
    "departamento": "Huanuco",
    "provincia": "Yarowilca",
    "distrito": "Choras"
  },
  {
    "ubigeo": "110101",
    "departamento": "Ica",
    "provincia": "Ica",
    "distrito": "Ica"
  },
  {
    "ubigeo": "110102",
    "departamento": "Ica",
    "provincia": "Ica",
    "distrito": "La Tinguiña"
  },
  {
    "ubigeo": "110103",
    "departamento": "Ica",
    "provincia": "Ica",
    "distrito": "Los Aquijes"
  },
  {
    "ubigeo": "110104",
    "departamento": "Ica",
    "provincia": "Ica",
    "distrito": "Ocucaje"
  },
  {
    "ubigeo": "110105",
    "departamento": "Ica",
    "provincia": "Ica",
    "distrito": "Pachacutec"
  },
  {
    "ubigeo": "110106",
    "departamento": "Ica",
    "provincia": "Ica",
    "distrito": "Parcona"
  },
  {
    "ubigeo": "110107",
    "departamento": "Ica",
    "provincia": "Ica",
    "distrito": "Pueblo Nuevo"
  },
  {
    "ubigeo": "110108",
    "departamento": "Ica",
    "provincia": "Ica",
    "distrito": "Salas"
  },
  {
    "ubigeo": "110109",
    "departamento": "Ica",
    "provincia": "Ica",
    "distrito": "San Jose de los Molinos"
  },
  {
    "ubigeo": "110110",
    "departamento": "Ica",
    "provincia": "Ica",
    "distrito": "San Juan Bautista"
  },
  {
    "ubigeo": "110111",
    "departamento": "Ica",
    "provincia": "Ica",
    "distrito": "Santiago"
  },
  {
    "ubigeo": "110112",
    "departamento": "Ica",
    "provincia": "Ica",
    "distrito": "Subtanjalla"
  },
  {
    "ubigeo": "110113",
    "departamento": "Ica",
    "provincia": "Ica",
    "distrito": "Tate"
  },
  {
    "ubigeo": "110114",
    "departamento": "Ica",
    "provincia": "Ica",
    "distrito": "Yauca del Rosario"
  },
  {
    "ubigeo": "110201",
    "departamento": "Ica",
    "provincia": "Chincha",
    "distrito": "Chincha Alta"
  },
  {
    "ubigeo": "110202",
    "departamento": "Ica",
    "provincia": "Chincha",
    "distrito": "Alto Laran"
  },
  {
    "ubigeo": "110203",
    "departamento": "Ica",
    "provincia": "Chincha",
    "distrito": "Chavin"
  },
  {
    "ubigeo": "110204",
    "departamento": "Ica",
    "provincia": "Chincha",
    "distrito": "Chincha Baja"
  },
  {
    "ubigeo": "110205",
    "departamento": "Ica",
    "provincia": "Chincha",
    "distrito": "El Carmen"
  },
  {
    "ubigeo": "110206",
    "departamento": "Ica",
    "provincia": "Chincha",
    "distrito": "Grocio Prado"
  },
  {
    "ubigeo": "110207",
    "departamento": "Ica",
    "provincia": "Chincha",
    "distrito": "Pueblo Nuevo"
  },
  {
    "ubigeo": "110208",
    "departamento": "Ica",
    "provincia": "Chincha",
    "distrito": "San Juan de Yanac"
  },
  {
    "ubigeo": "110209",
    "departamento": "Ica",
    "provincia": "Chincha",
    "distrito": "San Pedro de Huacarpana"
  },
  {
    "ubigeo": "110210",
    "departamento": "Ica",
    "provincia": "Chincha",
    "distrito": "Sunampe"
  },
  {
    "ubigeo": "110211",
    "departamento": "Ica",
    "provincia": "Chincha",
    "distrito": "Tambo de Mora"
  },
  {
    "ubigeo": "110301",
    "departamento": "Ica",
    "provincia": "Nazca",
    "distrito": "Nazca"
  },
  {
    "ubigeo": "110302",
    "departamento": "Ica",
    "provincia": "Nazca",
    "distrito": "Changuillo"
  },
  {
    "ubigeo": "110303",
    "departamento": "Ica",
    "provincia": "Nazca",
    "distrito": "El Ingenio"
  },
  {
    "ubigeo": "110304",
    "departamento": "Ica",
    "provincia": "Nazca",
    "distrito": "Marcona"
  },
  {
    "ubigeo": "110305",
    "departamento": "Ica",
    "provincia": "Nazca",
    "distrito": "Vista Alegre"
  },
  {
    "ubigeo": "110401",
    "departamento": "Ica",
    "provincia": "Palpa",
    "distrito": "Palpa"
  },
  {
    "ubigeo": "110402",
    "departamento": "Ica",
    "provincia": "Palpa",
    "distrito": "Llipata"
  },
  {
    "ubigeo": "110403",
    "departamento": "Ica",
    "provincia": "Palpa",
    "distrito": "Rio Grande"
  },
  {
    "ubigeo": "110404",
    "departamento": "Ica",
    "provincia": "Palpa",
    "distrito": "Santa Cruz"
  },
  {
    "ubigeo": "110405",
    "departamento": "Ica",
    "provincia": "Palpa",
    "distrito": "Tibillo"
  },
  {
    "ubigeo": "110501",
    "departamento": "Ica",
    "provincia": "Pisco",
    "distrito": "Pisco"
  },
  {
    "ubigeo": "110502",
    "departamento": "Ica",
    "provincia": "Pisco",
    "distrito": "Huancano"
  },
  {
    "ubigeo": "110503",
    "departamento": "Ica",
    "provincia": "Pisco",
    "distrito": "Humay"
  },
  {
    "ubigeo": "110504",
    "departamento": "Ica",
    "provincia": "Pisco",
    "distrito": "Independencia"
  },
  {
    "ubigeo": "110505",
    "departamento": "Ica",
    "provincia": "Pisco",
    "distrito": "Paracas"
  },
  {
    "ubigeo": "110506",
    "departamento": "Ica",
    "provincia": "Pisco",
    "distrito": "San Andrés"
  },
  {
    "ubigeo": "110507",
    "departamento": "Ica",
    "provincia": "Pisco",
    "distrito": "San Clemente"
  },
  {
    "ubigeo": "110508",
    "departamento": "Ica",
    "provincia": "Pisco",
    "distrito": "Tupac Amaru Inca"
  },
  {
    "ubigeo": "120101",
    "departamento": "Junín",
    "provincia": "Huancayo",
    "distrito": "Huancayo"
  },
  {
    "ubigeo": "120104",
    "departamento": "Junín",
    "provincia": "Huancayo",
    "distrito": "Carhuacallanga"
  },
  {
    "ubigeo": "120105",
    "departamento": "Junín",
    "provincia": "Huancayo",
    "distrito": "Chacapampa"
  },
  {
    "ubigeo": "120106",
    "departamento": "Junín",
    "provincia": "Huancayo",
    "distrito": "Chicche"
  },
  {
    "ubigeo": "120107",
    "departamento": "Junín",
    "provincia": "Huancayo",
    "distrito": "Chilca"
  },
  {
    "ubigeo": "120108",
    "departamento": "Junín",
    "provincia": "Huancayo",
    "distrito": "Chongos Alto"
  },
  {
    "ubigeo": "120111",
    "departamento": "Junín",
    "provincia": "Huancayo",
    "distrito": "Chupuro"
  },
  {
    "ubigeo": "120112",
    "departamento": "Junín",
    "provincia": "Huancayo",
    "distrito": "Colca"
  },
  {
    "ubigeo": "120113",
    "departamento": "Junín",
    "provincia": "Huancayo",
    "distrito": "Cullhuas"
  },
  {
    "ubigeo": "120114",
    "departamento": "Junín",
    "provincia": "Huancayo",
    "distrito": "El Tambo"
  },
  {
    "ubigeo": "120116",
    "departamento": "Junín",
    "provincia": "Huancayo",
    "distrito": "Huacrapuquio"
  },
  {
    "ubigeo": "120117",
    "departamento": "Junín",
    "provincia": "Huancayo",
    "distrito": "Hualhuas"
  },
  {
    "ubigeo": "120119",
    "departamento": "Junín",
    "provincia": "Huancayo",
    "distrito": "Huancan"
  },
  {
    "ubigeo": "120120",
    "departamento": "Junín",
    "provincia": "Huancayo",
    "distrito": "Huasicancha"
  },
  {
    "ubigeo": "120121",
    "departamento": "Junín",
    "provincia": "Huancayo",
    "distrito": "Huayucachi"
  },
  {
    "ubigeo": "120122",
    "departamento": "Junín",
    "provincia": "Huancayo",
    "distrito": "Ingenio"
  },
  {
    "ubigeo": "120124",
    "departamento": "Junín",
    "provincia": "Huancayo",
    "distrito": "Pariahuanca"
  },
  {
    "ubigeo": "120125",
    "departamento": "Junín",
    "provincia": "Huancayo",
    "distrito": "Pilcomayo"
  },
  {
    "ubigeo": "120126",
    "departamento": "Junín",
    "provincia": "Huancayo",
    "distrito": "Pucara"
  },
  {
    "ubigeo": "120127",
    "departamento": "Junín",
    "provincia": "Huancayo",
    "distrito": "Quichuay"
  },
  {
    "ubigeo": "120128",
    "departamento": "Junín",
    "provincia": "Huancayo",
    "distrito": "Quilcas"
  },
  {
    "ubigeo": "120129",
    "departamento": "Junín",
    "provincia": "Huancayo",
    "distrito": "San Agustín"
  },
  {
    "ubigeo": "120130",
    "departamento": "Junín",
    "provincia": "Huancayo",
    "distrito": "San Jerónimo de Tunan"
  },
  {
    "ubigeo": "120132",
    "departamento": "Junín",
    "provincia": "Huancayo",
    "distrito": "Saño"
  },
  {
    "ubigeo": "120133",
    "departamento": "Junín",
    "provincia": "Huancayo",
    "distrito": "Sapallanga"
  },
  {
    "ubigeo": "120134",
    "departamento": "Junín",
    "provincia": "Huancayo",
    "distrito": "Sicaya"
  },
  {
    "ubigeo": "120135",
    "departamento": "Junín",
    "provincia": "Huancayo",
    "distrito": "Santo Domingo de Acobamba"
  },
  {
    "ubigeo": "120136",
    "departamento": "Junín",
    "provincia": "Huancayo",
    "distrito": "Viques"
  },
  {
    "ubigeo": "120201",
    "departamento": "Junín",
    "provincia": "Concepcion",
    "distrito": "Concepcion"
  },
  {
    "ubigeo": "120202",
    "departamento": "Junín",
    "provincia": "Concepcion",
    "distrito": "Aco"
  },
  {
    "ubigeo": "120203",
    "departamento": "Junín",
    "provincia": "Concepcion",
    "distrito": "Andamarca"
  },
  {
    "ubigeo": "120204",
    "departamento": "Junín",
    "provincia": "Concepcion",
    "distrito": "Chambara"
  },
  {
    "ubigeo": "120205",
    "departamento": "Junín",
    "provincia": "Concepcion",
    "distrito": "Cochas"
  },
  {
    "ubigeo": "120206",
    "departamento": "Junín",
    "provincia": "Concepcion",
    "distrito": "Comas"
  },
  {
    "ubigeo": "120207",
    "departamento": "Junín",
    "provincia": "Concepcion",
    "distrito": "Heroínas Toledo"
  },
  {
    "ubigeo": "120208",
    "departamento": "Junín",
    "provincia": "Concepcion",
    "distrito": "Manzanares"
  },
  {
    "ubigeo": "120209",
    "departamento": "Junín",
    "provincia": "Concepcion",
    "distrito": "Mariscal Castilla"
  },
  {
    "ubigeo": "120210",
    "departamento": "Junín",
    "provincia": "Concepcion",
    "distrito": "Matahuasi"
  },
  {
    "ubigeo": "120211",
    "departamento": "Junín",
    "provincia": "Concepcion",
    "distrito": "Mito"
  },
  {
    "ubigeo": "120212",
    "departamento": "Junín",
    "provincia": "Concepcion",
    "distrito": "Nueve de Julio"
  },
  {
    "ubigeo": "120213",
    "departamento": "Junín",
    "provincia": "Concepcion",
    "distrito": "Orcotuna"
  },
  {
    "ubigeo": "120214",
    "departamento": "Junín",
    "provincia": "Concepcion",
    "distrito": "San Jose de Quero"
  },
  {
    "ubigeo": "120215",
    "departamento": "Junín",
    "provincia": "Concepcion",
    "distrito": "Santa Rosa de Ocopa"
  },
  {
    "ubigeo": "120301",
    "departamento": "Junín",
    "provincia": "Chanchamayo",
    "distrito": "Chanchamayo"
  },
  {
    "ubigeo": "120302",
    "departamento": "Junín",
    "provincia": "Chanchamayo",
    "distrito": "Perene"
  },
  {
    "ubigeo": "120303",
    "departamento": "Junín",
    "provincia": "Chanchamayo",
    "distrito": "Pichanaqui"
  },
  {
    "ubigeo": "120304",
    "departamento": "Junín",
    "provincia": "Chanchamayo",
    "distrito": "San Luis de Shuaro"
  },
  {
    "ubigeo": "120305",
    "departamento": "Junín",
    "provincia": "Chanchamayo",
    "distrito": "San Ramón"
  },
  {
    "ubigeo": "120306",
    "departamento": "Junín",
    "provincia": "Chanchamayo",
    "distrito": "Vitoc"
  },
  {
    "ubigeo": "120401",
    "departamento": "Junín",
    "provincia": "Jauja",
    "distrito": "Jauja"
  },
  {
    "ubigeo": "120402",
    "departamento": "Junín",
    "provincia": "Jauja",
    "distrito": "Acolla"
  },
  {
    "ubigeo": "120403",
    "departamento": "Junín",
    "provincia": "Jauja",
    "distrito": "Apata"
  },
  {
    "ubigeo": "120404",
    "departamento": "Junín",
    "provincia": "Jauja",
    "distrito": "Ataura"
  },
  {
    "ubigeo": "120405",
    "departamento": "Junín",
    "provincia": "Jauja",
    "distrito": "Canchayllo"
  },
  {
    "ubigeo": "120406",
    "departamento": "Junín",
    "provincia": "Jauja",
    "distrito": "Curicaca"
  },
  {
    "ubigeo": "120407",
    "departamento": "Junín",
    "provincia": "Jauja",
    "distrito": "El Mantaro"
  },
  {
    "ubigeo": "120408",
    "departamento": "Junín",
    "provincia": "Jauja",
    "distrito": "Huamali"
  },
  {
    "ubigeo": "120409",
    "departamento": "Junín",
    "provincia": "Jauja",
    "distrito": "Huaripampa"
  },
  {
    "ubigeo": "120410",
    "departamento": "Junín",
    "provincia": "Jauja",
    "distrito": "Huertas"
  },
  {
    "ubigeo": "120411",
    "departamento": "Junín",
    "provincia": "Jauja",
    "distrito": "Janjaillo"
  },
  {
    "ubigeo": "120412",
    "departamento": "Junín",
    "provincia": "Jauja",
    "distrito": "Julcan"
  },
  {
    "ubigeo": "120413",
    "departamento": "Junín",
    "provincia": "Jauja",
    "distrito": "Leonor Ordóñez"
  },
  {
    "ubigeo": "120414",
    "departamento": "Junín",
    "provincia": "Jauja",
    "distrito": "Llocllapampa"
  },
  {
    "ubigeo": "120415",
    "departamento": "Junín",
    "provincia": "Jauja",
    "distrito": "Marco"
  },
  {
    "ubigeo": "120416",
    "departamento": "Junín",
    "provincia": "Jauja",
    "distrito": "Masma"
  },
  {
    "ubigeo": "120417",
    "departamento": "Junín",
    "provincia": "Jauja",
    "distrito": "Masma Chicche"
  },
  {
    "ubigeo": "120418",
    "departamento": "Junín",
    "provincia": "Jauja",
    "distrito": "Molinos"
  },
  {
    "ubigeo": "120419",
    "departamento": "Junín",
    "provincia": "Jauja",
    "distrito": "Monobamba"
  },
  {
    "ubigeo": "120420",
    "departamento": "Junín",
    "provincia": "Jauja",
    "distrito": "Muqui"
  },
  {
    "ubigeo": "120421",
    "departamento": "Junín",
    "provincia": "Jauja",
    "distrito": "Muquiyauyo"
  },
  {
    "ubigeo": "120422",
    "departamento": "Junín",
    "provincia": "Jauja",
    "distrito": "Paca"
  },
  {
    "ubigeo": "120423",
    "departamento": "Junín",
    "provincia": "Jauja",
    "distrito": "Paccha"
  },
  {
    "ubigeo": "120424",
    "departamento": "Junín",
    "provincia": "Jauja",
    "distrito": "Pancan"
  },
  {
    "ubigeo": "120425",
    "departamento": "Junín",
    "provincia": "Jauja",
    "distrito": "Parco"
  },
  {
    "ubigeo": "120426",
    "departamento": "Junín",
    "provincia": "Jauja",
    "distrito": "Pomacancha"
  },
  {
    "ubigeo": "120427",
    "departamento": "Junín",
    "provincia": "Jauja",
    "distrito": "Ricran"
  },
  {
    "ubigeo": "120428",
    "departamento": "Junín",
    "provincia": "Jauja",
    "distrito": "San Lorenzo"
  },
  {
    "ubigeo": "120429",
    "departamento": "Junín",
    "provincia": "Jauja",
    "distrito": "San Pedro de Chunan"
  },
  {
    "ubigeo": "120430",
    "departamento": "Junín",
    "provincia": "Jauja",
    "distrito": "Sausa"
  },
  {
    "ubigeo": "120431",
    "departamento": "Junín",
    "provincia": "Jauja",
    "distrito": "Sincos"
  },
  {
    "ubigeo": "120432",
    "departamento": "Junín",
    "provincia": "Jauja",
    "distrito": "Tunan Marca"
  },
  {
    "ubigeo": "120433",
    "departamento": "Junín",
    "provincia": "Jauja",
    "distrito": "Yauli"
  },
  {
    "ubigeo": "120434",
    "departamento": "Junín",
    "provincia": "Jauja",
    "distrito": "Yauyos"
  },
  {
    "ubigeo": "120501",
    "departamento": "Junín",
    "provincia": "Junín",
    "distrito": "Junín"
  },
  {
    "ubigeo": "120502",
    "departamento": "Junín",
    "provincia": "Junín",
    "distrito": "Carhuamayo"
  },
  {
    "ubigeo": "120503",
    "departamento": "Junín",
    "provincia": "Junín",
    "distrito": "Ondores"
  },
  {
    "ubigeo": "120504",
    "departamento": "Junín",
    "provincia": "Junín",
    "distrito": "Ulcumayo"
  },
  {
    "ubigeo": "120601",
    "departamento": "Junín",
    "provincia": "Satipo",
    "distrito": "Satipo"
  },
  {
    "ubigeo": "120602",
    "departamento": "Junín",
    "provincia": "Satipo",
    "distrito": "Coviriali"
  },
  {
    "ubigeo": "120603",
    "departamento": "Junín",
    "provincia": "Satipo",
    "distrito": "Llaylla"
  },
  {
    "ubigeo": "120604",
    "departamento": "Junín",
    "provincia": "Satipo",
    "distrito": "Mazamari"
  },
  {
    "ubigeo": "120605",
    "departamento": "Junín",
    "provincia": "Satipo",
    "distrito": "Pampa Hermosa"
  },
  {
    "ubigeo": "120606",
    "departamento": "Junín",
    "provincia": "Satipo",
    "distrito": "Pangoa"
  },
  {
    "ubigeo": "120607",
    "departamento": "Junín",
    "provincia": "Satipo",
    "distrito": "Rio Negro"
  },
  {
    "ubigeo": "120608",
    "departamento": "Junín",
    "provincia": "Satipo",
    "distrito": "Rio Tambo"
  },
  {
    "ubigeo": "120609",
    "departamento": "Junín",
    "provincia": "Satipo",
    "distrito": "Vizcatan del Ene"
  },
  {
    "ubigeo": "120701",
    "departamento": "Junín",
    "provincia": "Tarma",
    "distrito": "Tarma"
  },
  {
    "ubigeo": "120702",
    "departamento": "Junín",
    "provincia": "Tarma",
    "distrito": "Acobamba"
  },
  {
    "ubigeo": "120703",
    "departamento": "Junín",
    "provincia": "Tarma",
    "distrito": "Huaricolca"
  },
  {
    "ubigeo": "120704",
    "departamento": "Junín",
    "provincia": "Tarma",
    "distrito": "Huasahuasi"
  },
  {
    "ubigeo": "120705",
    "departamento": "Junín",
    "provincia": "Tarma",
    "distrito": "La Union"
  },
  {
    "ubigeo": "120706",
    "departamento": "Junín",
    "provincia": "Tarma",
    "distrito": "Palca"
  },
  {
    "ubigeo": "120707",
    "departamento": "Junín",
    "provincia": "Tarma",
    "distrito": "Palcamayo"
  },
  {
    "ubigeo": "120708",
    "departamento": "Junín",
    "provincia": "Tarma",
    "distrito": "San Pedro de Cajas"
  },
  {
    "ubigeo": "120709",
    "departamento": "Junín",
    "provincia": "Tarma",
    "distrito": "Tapo"
  },
  {
    "ubigeo": "120801",
    "departamento": "Junín",
    "provincia": "Yauli",
    "distrito": "La Oroya"
  },
  {
    "ubigeo": "120802",
    "departamento": "Junín",
    "provincia": "Yauli",
    "distrito": "Chacapalpa"
  },
  {
    "ubigeo": "120803",
    "departamento": "Junín",
    "provincia": "Yauli",
    "distrito": "Huay-Huay"
  },
  {
    "ubigeo": "120804",
    "departamento": "Junín",
    "provincia": "Yauli",
    "distrito": "Marcapomacocha"
  },
  {
    "ubigeo": "120805",
    "departamento": "Junín",
    "provincia": "Yauli",
    "distrito": "Morococha"
  },
  {
    "ubigeo": "120806",
    "departamento": "Junín",
    "provincia": "Yauli",
    "distrito": "Paccha"
  },
  {
    "ubigeo": "120807",
    "departamento": "Junín",
    "provincia": "Yauli",
    "distrito": "Santa Barbara de Carhuacayan"
  },
  {
    "ubigeo": "120808",
    "departamento": "Junín",
    "provincia": "Yauli",
    "distrito": "Santa Rosa de Sacco"
  },
  {
    "ubigeo": "120809",
    "departamento": "Junín",
    "provincia": "Yauli",
    "distrito": "Suitucancha"
  },
  {
    "ubigeo": "120810",
    "departamento": "Junín",
    "provincia": "Yauli",
    "distrito": "Yauli"
  },
  {
    "ubigeo": "120901",
    "departamento": "Junín",
    "provincia": "Chupaca",
    "distrito": "Chupaca"
  },
  {
    "ubigeo": "120902",
    "departamento": "Junín",
    "provincia": "Chupaca",
    "distrito": "Ahuac"
  },
  {
    "ubigeo": "120903",
    "departamento": "Junín",
    "provincia": "Chupaca",
    "distrito": "Chongos Bajo"
  },
  {
    "ubigeo": "120904",
    "departamento": "Junín",
    "provincia": "Chupaca",
    "distrito": "Huachac"
  },
  {
    "ubigeo": "120905",
    "departamento": "Junín",
    "provincia": "Chupaca",
    "distrito": "Huamancaca Chico"
  },
  {
    "ubigeo": "120906",
    "departamento": "Junín",
    "provincia": "Chupaca",
    "distrito": "San Juan de Yscos"
  },
  {
    "ubigeo": "120907",
    "departamento": "Junín",
    "provincia": "Chupaca",
    "distrito": "San Juan de Jarpa"
  },
  {
    "ubigeo": "120908",
    "departamento": "Junín",
    "provincia": "Chupaca",
    "distrito": "Tres de Diciembre"
  },
  {
    "ubigeo": "120909",
    "departamento": "Junín",
    "provincia": "Chupaca",
    "distrito": "Yanacancha"
  },
  {
    "ubigeo": "130101",
    "departamento": "La Libertad",
    "provincia": "Trujillo",
    "distrito": "Trujillo"
  },
  {
    "ubigeo": "130102",
    "departamento": "La Libertad",
    "provincia": "Trujillo",
    "distrito": "El Porvenir"
  },
  {
    "ubigeo": "130103",
    "departamento": "La Libertad",
    "provincia": "Trujillo",
    "distrito": "Florencia de Mora"
  },
  {
    "ubigeo": "130104",
    "departamento": "La Libertad",
    "provincia": "Trujillo",
    "distrito": "Huanchaco"
  },
  {
    "ubigeo": "130105",
    "departamento": "La Libertad",
    "provincia": "Trujillo",
    "distrito": "La Esperanza"
  },
  {
    "ubigeo": "130106",
    "departamento": "La Libertad",
    "provincia": "Trujillo",
    "distrito": "Laredo"
  },
  {
    "ubigeo": "130107",
    "departamento": "La Libertad",
    "provincia": "Trujillo",
    "distrito": "Moche"
  },
  {
    "ubigeo": "130108",
    "departamento": "La Libertad",
    "provincia": "Trujillo",
    "distrito": "Poroto"
  },
  {
    "ubigeo": "130109",
    "departamento": "La Libertad",
    "provincia": "Trujillo",
    "distrito": "Salaverry"
  },
  {
    "ubigeo": "130110",
    "departamento": "La Libertad",
    "provincia": "Trujillo",
    "distrito": "Simbal"
  },
  {
    "ubigeo": "130111",
    "departamento": "La Libertad",
    "provincia": "Trujillo",
    "distrito": "Victor Larco Herrera"
  },
  {
    "ubigeo": "130201",
    "departamento": "La Libertad",
    "provincia": "Ascope",
    "distrito": "Ascope"
  },
  {
    "ubigeo": "130202",
    "departamento": "La Libertad",
    "provincia": "Ascope",
    "distrito": "Chicama"
  },
  {
    "ubigeo": "130203",
    "departamento": "La Libertad",
    "provincia": "Ascope",
    "distrito": "Chocope"
  },
  {
    "ubigeo": "130204",
    "departamento": "La Libertad",
    "provincia": "Ascope",
    "distrito": "Magdalena de Cao"
  },
  {
    "ubigeo": "130205",
    "departamento": "La Libertad",
    "provincia": "Ascope",
    "distrito": "Paijan"
  },
  {
    "ubigeo": "130206",
    "departamento": "La Libertad",
    "provincia": "Ascope",
    "distrito": "Rázuri"
  },
  {
    "ubigeo": "130207",
    "departamento": "La Libertad",
    "provincia": "Ascope",
    "distrito": "Santiago de Cao"
  },
  {
    "ubigeo": "130208",
    "departamento": "La Libertad",
    "provincia": "Ascope",
    "distrito": "Casa Grande"
  },
  {
    "ubigeo": "130301",
    "departamento": "La Libertad",
    "provincia": "Bolivar",
    "distrito": "Bolivar"
  },
  {
    "ubigeo": "130302",
    "departamento": "La Libertad",
    "provincia": "Bolivar",
    "distrito": "Bambamarca"
  },
  {
    "ubigeo": "130303",
    "departamento": "La Libertad",
    "provincia": "Bolivar",
    "distrito": "Condormarca"
  },
  {
    "ubigeo": "130304",
    "departamento": "La Libertad",
    "provincia": "Bolivar",
    "distrito": "Longotea"
  },
  {
    "ubigeo": "130305",
    "departamento": "La Libertad",
    "provincia": "Bolivar",
    "distrito": "Uchumarca"
  },
  {
    "ubigeo": "130306",
    "departamento": "La Libertad",
    "provincia": "Bolivar",
    "distrito": "Ucuncha"
  },
  {
    "ubigeo": "130401",
    "departamento": "La Libertad",
    "provincia": "Chepén",
    "distrito": "Chepén"
  },
  {
    "ubigeo": "130402",
    "departamento": "La Libertad",
    "provincia": "Chepén",
    "distrito": "Pacanga"
  },
  {
    "ubigeo": "130403",
    "departamento": "La Libertad",
    "provincia": "Chepén",
    "distrito": "Pueblo Nuevo"
  },
  {
    "ubigeo": "130501",
    "departamento": "La Libertad",
    "provincia": "Julcan",
    "distrito": "Julcan"
  },
  {
    "ubigeo": "130502",
    "departamento": "La Libertad",
    "provincia": "Julcan",
    "distrito": "Calamarca"
  },
  {
    "ubigeo": "130503",
    "departamento": "La Libertad",
    "provincia": "Julcan",
    "distrito": "Carabamba"
  },
  {
    "ubigeo": "130504",
    "departamento": "La Libertad",
    "provincia": "Julcan",
    "distrito": "Huaso"
  },
  {
    "ubigeo": "130601",
    "departamento": "La Libertad",
    "provincia": "Otuzco",
    "distrito": "Otuzco"
  },
  {
    "ubigeo": "130602",
    "departamento": "La Libertad",
    "provincia": "Otuzco",
    "distrito": "Agallpampa"
  },
  {
    "ubigeo": "130604",
    "departamento": "La Libertad",
    "provincia": "Otuzco",
    "distrito": "Charat"
  },
  {
    "ubigeo": "130605",
    "departamento": "La Libertad",
    "provincia": "Otuzco",
    "distrito": "Huaranchal"
  },
  {
    "ubigeo": "130606",
    "departamento": "La Libertad",
    "provincia": "Otuzco",
    "distrito": "La Cuesta"
  },
  {
    "ubigeo": "130608",
    "departamento": "La Libertad",
    "provincia": "Otuzco",
    "distrito": "Mache"
  },
  {
    "ubigeo": "130610",
    "departamento": "La Libertad",
    "provincia": "Otuzco",
    "distrito": "Paranday"
  },
  {
    "ubigeo": "130611",
    "departamento": "La Libertad",
    "provincia": "Otuzco",
    "distrito": "Salpo"
  },
  {
    "ubigeo": "130613",
    "departamento": "La Libertad",
    "provincia": "Otuzco",
    "distrito": "Sinsicap"
  },
  {
    "ubigeo": "130614",
    "departamento": "La Libertad",
    "provincia": "Otuzco",
    "distrito": "Usquil"
  },
  {
    "ubigeo": "130701",
    "departamento": "La Libertad",
    "provincia": "Pacasmayo",
    "distrito": "San Pedro de Lloc"
  },
  {
    "ubigeo": "130702",
    "departamento": "La Libertad",
    "provincia": "Pacasmayo",
    "distrito": "Guadalupe"
  },
  {
    "ubigeo": "130703",
    "departamento": "La Libertad",
    "provincia": "Pacasmayo",
    "distrito": "Jequetepeque"
  },
  {
    "ubigeo": "130704",
    "departamento": "La Libertad",
    "provincia": "Pacasmayo",
    "distrito": "Pacasmayo"
  },
  {
    "ubigeo": "130705",
    "departamento": "La Libertad",
    "provincia": "Pacasmayo",
    "distrito": "San Jose"
  },
  {
    "ubigeo": "130801",
    "departamento": "La Libertad",
    "provincia": "Pataz",
    "distrito": "Tayabamba"
  },
  {
    "ubigeo": "130802",
    "departamento": "La Libertad",
    "provincia": "Pataz",
    "distrito": "Buldibuyo"
  },
  {
    "ubigeo": "130803",
    "departamento": "La Libertad",
    "provincia": "Pataz",
    "distrito": "Chillia"
  },
  {
    "ubigeo": "130804",
    "departamento": "La Libertad",
    "provincia": "Pataz",
    "distrito": "Huancaspata"
  },
  {
    "ubigeo": "130805",
    "departamento": "La Libertad",
    "provincia": "Pataz",
    "distrito": "Huaylillas"
  },
  {
    "ubigeo": "130806",
    "departamento": "La Libertad",
    "provincia": "Pataz",
    "distrito": "Huayo"
  },
  {
    "ubigeo": "130807",
    "departamento": "La Libertad",
    "provincia": "Pataz",
    "distrito": "Ongon"
  },
  {
    "ubigeo": "130808",
    "departamento": "La Libertad",
    "provincia": "Pataz",
    "distrito": "Parcoy"
  },
  {
    "ubigeo": "130809",
    "departamento": "La Libertad",
    "provincia": "Pataz",
    "distrito": "Pataz"
  },
  {
    "ubigeo": "130810",
    "departamento": "La Libertad",
    "provincia": "Pataz",
    "distrito": "Pias"
  },
  {
    "ubigeo": "130811",
    "departamento": "La Libertad",
    "provincia": "Pataz",
    "distrito": "Santiago de Challas"
  },
  {
    "ubigeo": "130812",
    "departamento": "La Libertad",
    "provincia": "Pataz",
    "distrito": "Taurija"
  },
  {
    "ubigeo": "130813",
    "departamento": "La Libertad",
    "provincia": "Pataz",
    "distrito": "Urpay"
  },
  {
    "ubigeo": "130901",
    "departamento": "La Libertad",
    "provincia": "Sánchez Carrión",
    "distrito": "Huamachuco"
  },
  {
    "ubigeo": "130902",
    "departamento": "La Libertad",
    "provincia": "Sánchez Carrión",
    "distrito": "Chugay"
  },
  {
    "ubigeo": "130903",
    "departamento": "La Libertad",
    "provincia": "Sánchez Carrión",
    "distrito": "Cochorco"
  },
  {
    "ubigeo": "130904",
    "departamento": "La Libertad",
    "provincia": "Sánchez Carrión",
    "distrito": "Curgos"
  },
  {
    "ubigeo": "130905",
    "departamento": "La Libertad",
    "provincia": "Sánchez Carrión",
    "distrito": "Marcabal"
  },
  {
    "ubigeo": "130906",
    "departamento": "La Libertad",
    "provincia": "Sánchez Carrión",
    "distrito": "Sanagoran"
  },
  {
    "ubigeo": "130907",
    "departamento": "La Libertad",
    "provincia": "Sánchez Carrión",
    "distrito": "Sarin"
  },
  {
    "ubigeo": "130908",
    "departamento": "La Libertad",
    "provincia": "Sánchez Carrión",
    "distrito": "Sartimbamba"
  },
  {
    "ubigeo": "131001",
    "departamento": "La Libertad",
    "provincia": "Santiago de Chuco",
    "distrito": "Santiago de Chuco"
  },
  {
    "ubigeo": "131002",
    "departamento": "La Libertad",
    "provincia": "Santiago de Chuco",
    "distrito": "Angasmarca"
  },
  {
    "ubigeo": "131003",
    "departamento": "La Libertad",
    "provincia": "Santiago de Chuco",
    "distrito": "Cachicadan"
  },
  {
    "ubigeo": "131004",
    "departamento": "La Libertad",
    "provincia": "Santiago de Chuco",
    "distrito": "Mollebamba"
  },
  {
    "ubigeo": "131005",
    "departamento": "La Libertad",
    "provincia": "Santiago de Chuco",
    "distrito": "Mollepata"
  },
  {
    "ubigeo": "131006",
    "departamento": "La Libertad",
    "provincia": "Santiago de Chuco",
    "distrito": "Quiruvilca"
  },
  {
    "ubigeo": "131007",
    "departamento": "La Libertad",
    "provincia": "Santiago de Chuco",
    "distrito": "Santa Cruz de Chuca"
  },
  {
    "ubigeo": "131008",
    "departamento": "La Libertad",
    "provincia": "Santiago de Chuco",
    "distrito": "Sitabamba"
  },
  {
    "ubigeo": "131101",
    "departamento": "La Libertad",
    "provincia": "Gran Chimú",
    "distrito": "Cascas"
  },
  {
    "ubigeo": "131102",
    "departamento": "La Libertad",
    "provincia": "Gran Chimú",
    "distrito": "Lucma"
  },
  {
    "ubigeo": "131103",
    "departamento": "La Libertad",
    "provincia": "Gran Chimú",
    "distrito": "Compin"
  },
  {
    "ubigeo": "131104",
    "departamento": "La Libertad",
    "provincia": "Gran Chimú",
    "distrito": "Sayapullo"
  },
  {
    "ubigeo": "131201",
    "departamento": "La Libertad",
    "provincia": "Virú",
    "distrito": "Virú"
  },
  {
    "ubigeo": "131202",
    "departamento": "La Libertad",
    "provincia": "Virú",
    "distrito": "Chao"
  },
  {
    "ubigeo": "131203",
    "departamento": "La Libertad",
    "provincia": "Virú",
    "distrito": "Guadalupito"
  },
  {
    "ubigeo": "140101",
    "departamento": "Lambayeque",
    "provincia": "Chiclayo",
    "distrito": "Chiclayo"
  },
  {
    "ubigeo": "140102",
    "departamento": "Lambayeque",
    "provincia": "Chiclayo",
    "distrito": "Chongoyape"
  },
  {
    "ubigeo": "140103",
    "departamento": "Lambayeque",
    "provincia": "Chiclayo",
    "distrito": "Eten"
  },
  {
    "ubigeo": "140104",
    "departamento": "Lambayeque",
    "provincia": "Chiclayo",
    "distrito": "Eten Puerto"
  },
  {
    "ubigeo": "140105",
    "departamento": "Lambayeque",
    "provincia": "Chiclayo",
    "distrito": "Jose Leonardo Ortiz"
  },
  {
    "ubigeo": "140106",
    "departamento": "Lambayeque",
    "provincia": "Chiclayo",
    "distrito": "La Victoria"
  },
  {
    "ubigeo": "140107",
    "departamento": "Lambayeque",
    "provincia": "Chiclayo",
    "distrito": "Lagunas"
  },
  {
    "ubigeo": "140108",
    "departamento": "Lambayeque",
    "provincia": "Chiclayo",
    "distrito": "Monsefu"
  },
  {
    "ubigeo": "140109",
    "departamento": "Lambayeque",
    "provincia": "Chiclayo",
    "distrito": "Nueva Arica"
  },
  {
    "ubigeo": "140110",
    "departamento": "Lambayeque",
    "provincia": "Chiclayo",
    "distrito": "Oyotun"
  },
  {
    "ubigeo": "140111",
    "departamento": "Lambayeque",
    "provincia": "Chiclayo",
    "distrito": "Picsi"
  },
  {
    "ubigeo": "140112",
    "departamento": "Lambayeque",
    "provincia": "Chiclayo",
    "distrito": "Pimentel"
  },
  {
    "ubigeo": "140113",
    "departamento": "Lambayeque",
    "provincia": "Chiclayo",
    "distrito": "Reque"
  },
  {
    "ubigeo": "140114",
    "departamento": "Lambayeque",
    "provincia": "Chiclayo",
    "distrito": "Santa Rosa"
  },
  {
    "ubigeo": "140115",
    "departamento": "Lambayeque",
    "provincia": "Chiclayo",
    "distrito": "Saña"
  },
  {
    "ubigeo": "140116",
    "departamento": "Lambayeque",
    "provincia": "Chiclayo",
    "distrito": "Cayalti"
  },
  {
    "ubigeo": "140117",
    "departamento": "Lambayeque",
    "provincia": "Chiclayo",
    "distrito": "Patapo"
  },
  {
    "ubigeo": "140118",
    "departamento": "Lambayeque",
    "provincia": "Chiclayo",
    "distrito": "Pomalca"
  },
  {
    "ubigeo": "140119",
    "departamento": "Lambayeque",
    "provincia": "Chiclayo",
    "distrito": "Pucala"
  },
  {
    "ubigeo": "140120",
    "departamento": "Lambayeque",
    "provincia": "Chiclayo",
    "distrito": "Tuman"
  },
  {
    "ubigeo": "140201",
    "departamento": "Lambayeque",
    "provincia": "Ferreñafe",
    "distrito": "Ferreñafe"
  },
  {
    "ubigeo": "140202",
    "departamento": "Lambayeque",
    "provincia": "Ferreñafe",
    "distrito": "Cañaris"
  },
  {
    "ubigeo": "140203",
    "departamento": "Lambayeque",
    "provincia": "Ferreñafe",
    "distrito": "Incahuasi"
  },
  {
    "ubigeo": "140204",
    "departamento": "Lambayeque",
    "provincia": "Ferreñafe",
    "distrito": "Manuel Antonio Mesones Muro"
  },
  {
    "ubigeo": "140205",
    "departamento": "Lambayeque",
    "provincia": "Ferreñafe",
    "distrito": "Pitipo"
  },
  {
    "ubigeo": "140206",
    "departamento": "Lambayeque",
    "provincia": "Ferreñafe",
    "distrito": "Pueblo Nuevo"
  },
  {
    "ubigeo": "140301",
    "departamento": "Lambayeque",
    "provincia": "Lambayeque",
    "distrito": "Lambayeque"
  },
  {
    "ubigeo": "140302",
    "departamento": "Lambayeque",
    "provincia": "Lambayeque",
    "distrito": "Chochope"
  },
  {
    "ubigeo": "140303",
    "departamento": "Lambayeque",
    "provincia": "Lambayeque",
    "distrito": "Illimo"
  },
  {
    "ubigeo": "140304",
    "departamento": "Lambayeque",
    "provincia": "Lambayeque",
    "distrito": "Jayanca"
  },
  {
    "ubigeo": "140305",
    "departamento": "Lambayeque",
    "provincia": "Lambayeque",
    "distrito": "Mochumi"
  },
  {
    "ubigeo": "140306",
    "departamento": "Lambayeque",
    "provincia": "Lambayeque",
    "distrito": "Morrope"
  },
  {
    "ubigeo": "140307",
    "departamento": "Lambayeque",
    "provincia": "Lambayeque",
    "distrito": "Motupe"
  },
  {
    "ubigeo": "140308",
    "departamento": "Lambayeque",
    "provincia": "Lambayeque",
    "distrito": "Olmos"
  },
  {
    "ubigeo": "140309",
    "departamento": "Lambayeque",
    "provincia": "Lambayeque",
    "distrito": "Pacora"
  },
  {
    "ubigeo": "140310",
    "departamento": "Lambayeque",
    "provincia": "Lambayeque",
    "distrito": "Salas"
  },
  {
    "ubigeo": "140311",
    "departamento": "Lambayeque",
    "provincia": "Lambayeque",
    "distrito": "San Jose"
  },
  {
    "ubigeo": "140312",
    "departamento": "Lambayeque",
    "provincia": "Lambayeque",
    "distrito": "Tucume"
  },
  {
    "ubigeo": "150101",
    "departamento": "Lima",
    "provincia": "Lima",
    "distrito": "Lima"
  },
  {
    "ubigeo": "150102",
    "departamento": "Lima",
    "provincia": "Lima",
    "distrito": "Ancón"
  },
  {
    "ubigeo": "150103",
    "departamento": "Lima",
    "provincia": "Lima",
    "distrito": "Ate"
  },
  {
    "ubigeo": "150104",
    "departamento": "Lima",
    "provincia": "Lima",
    "distrito": "Barranco"
  },
  {
    "ubigeo": "150105",
    "departamento": "Lima",
    "provincia": "Lima",
    "distrito": "Breña"
  },
  {
    "ubigeo": "150106",
    "departamento": "Lima",
    "provincia": "Lima",
    "distrito": "Carabayllo"
  },
  {
    "ubigeo": "150107",
    "departamento": "Lima",
    "provincia": "Lima",
    "distrito": "Chaclacayo"
  },
  {
    "ubigeo": "150108",
    "departamento": "Lima",
    "provincia": "Lima",
    "distrito": "Chorrillos"
  },
  {
    "ubigeo": "150109",
    "departamento": "Lima",
    "provincia": "Lima",
    "distrito": "Cieneguilla"
  },
  {
    "ubigeo": "150110",
    "departamento": "Lima",
    "provincia": "Lima",
    "distrito": "Comas"
  },
  {
    "ubigeo": "150111",
    "departamento": "Lima",
    "provincia": "Lima",
    "distrito": "El Agustino"
  },
  {
    "ubigeo": "150112",
    "departamento": "Lima",
    "provincia": "Lima",
    "distrito": "Independencia"
  },
  {
    "ubigeo": "150113",
    "departamento": "Lima",
    "provincia": "Lima",
    "distrito": "Jesus Maria"
  },
  {
    "ubigeo": "150114",
    "departamento": "Lima",
    "provincia": "Lima",
    "distrito": "La Molina"
  },
  {
    "ubigeo": "150115",
    "departamento": "Lima",
    "provincia": "Lima",
    "distrito": "La Victoria"
  },
  {
    "ubigeo": "150116",
    "departamento": "Lima",
    "provincia": "Lima",
    "distrito": "Lince"
  },
  {
    "ubigeo": "150117",
    "departamento": "Lima",
    "provincia": "Lima",
    "distrito": "Los Olivos"
  },
  {
    "ubigeo": "150118",
    "departamento": "Lima",
    "provincia": "Lima",
    "distrito": "Lurigancho"
  },
  {
    "ubigeo": "150119",
    "departamento": "Lima",
    "provincia": "Lima",
    "distrito": "Lurin"
  },
  {
    "ubigeo": "150120",
    "departamento": "Lima",
    "provincia": "Lima",
    "distrito": "Magdalena del Mar"
  },
  {
    "ubigeo": "150121",
    "departamento": "Lima",
    "provincia": "Lima",
    "distrito": "Pueblo Libre"
  },
  {
    "ubigeo": "150122",
    "departamento": "Lima",
    "provincia": "Lima",
    "distrito": "Miraflores"
  },
  {
    "ubigeo": "150123",
    "departamento": "Lima",
    "provincia": "Lima",
    "distrito": "Pachacamac"
  },
  {
    "ubigeo": "150124",
    "departamento": "Lima",
    "provincia": "Lima",
    "distrito": "Pucusana"
  },
  {
    "ubigeo": "150125",
    "departamento": "Lima",
    "provincia": "Lima",
    "distrito": "Puente Piedra"
  },
  {
    "ubigeo": "150126",
    "departamento": "Lima",
    "provincia": "Lima",
    "distrito": "Punta Hermosa"
  },
  {
    "ubigeo": "150127",
    "departamento": "Lima",
    "provincia": "Lima",
    "distrito": "Punta Negra"
  },
  {
    "ubigeo": "150128",
    "departamento": "Lima",
    "provincia": "Lima",
    "distrito": "Rímac"
  },
  {
    "ubigeo": "150129",
    "departamento": "Lima",
    "provincia": "Lima",
    "distrito": "San Bartolo"
  },
  {
    "ubigeo": "150130",
    "departamento": "Lima",
    "provincia": "Lima",
    "distrito": "San Borja"
  },
  {
    "ubigeo": "150131",
    "departamento": "Lima",
    "provincia": "Lima",
    "distrito": "San Isidro"
  },
  {
    "ubigeo": "150132",
    "departamento": "Lima",
    "provincia": "Lima",
    "distrito": "San Juan de Lurigancho"
  },
  {
    "ubigeo": "150133",
    "departamento": "Lima",
    "provincia": "Lima",
    "distrito": "San Juan de Miraflores"
  },
  {
    "ubigeo": "150134",
    "departamento": "Lima",
    "provincia": "Lima",
    "distrito": "San Luis"
  },
  {
    "ubigeo": "150135",
    "departamento": "Lima",
    "provincia": "Lima",
    "distrito": "San Martín de Porres"
  },
  {
    "ubigeo": "150136",
    "departamento": "Lima",
    "provincia": "Lima",
    "distrito": "San Miguel"
  },
  {
    "ubigeo": "150137",
    "departamento": "Lima",
    "provincia": "Lima",
    "distrito": "Santa Anita"
  },
  {
    "ubigeo": "150138",
    "departamento": "Lima",
    "provincia": "Lima",
    "distrito": "Santa Maria del Mar"
  },
  {
    "ubigeo": "150139",
    "departamento": "Lima",
    "provincia": "Lima",
    "distrito": "Santa Rosa"
  },
  {
    "ubigeo": "150140",
    "departamento": "Lima",
    "provincia": "Lima",
    "distrito": "Santiago de Surco"
  },
  {
    "ubigeo": "150141",
    "departamento": "Lima",
    "provincia": "Lima",
    "distrito": "Surquillo"
  },
  {
    "ubigeo": "150142",
    "departamento": "Lima",
    "provincia": "Lima",
    "distrito": "Villa El Salvador"
  },
  {
    "ubigeo": "150143",
    "departamento": "Lima",
    "provincia": "Lima",
    "distrito": "Villa Maria del Triunfo"
  },
  {
    "ubigeo": "150201",
    "departamento": "Lima",
    "provincia": "Barranca",
    "distrito": "Barranca"
  },
  {
    "ubigeo": "150202",
    "departamento": "Lima",
    "provincia": "Barranca",
    "distrito": "Paramonga"
  },
  {
    "ubigeo": "150203",
    "departamento": "Lima",
    "provincia": "Barranca",
    "distrito": "Pativilca"
  },
  {
    "ubigeo": "150204",
    "departamento": "Lima",
    "provincia": "Barranca",
    "distrito": "Supe"
  },
  {
    "ubigeo": "150205",
    "departamento": "Lima",
    "provincia": "Barranca",
    "distrito": "Supe Puerto"
  },
  {
    "ubigeo": "150301",
    "departamento": "Lima",
    "provincia": "Cajatambo",
    "distrito": "Cajatambo"
  },
  {
    "ubigeo": "150302",
    "departamento": "Lima",
    "provincia": "Cajatambo",
    "distrito": "Copa"
  },
  {
    "ubigeo": "150303",
    "departamento": "Lima",
    "provincia": "Cajatambo",
    "distrito": "Gorgor"
  },
  {
    "ubigeo": "150304",
    "departamento": "Lima",
    "provincia": "Cajatambo",
    "distrito": "Huancapon"
  },
  {
    "ubigeo": "150305",
    "departamento": "Lima",
    "provincia": "Cajatambo",
    "distrito": "Manas"
  },
  {
    "ubigeo": "150401",
    "departamento": "Lima",
    "provincia": "Canta",
    "distrito": "Canta"
  },
  {
    "ubigeo": "150402",
    "departamento": "Lima",
    "provincia": "Canta",
    "distrito": "Arahuay"
  },
  {
    "ubigeo": "150403",
    "departamento": "Lima",
    "provincia": "Canta",
    "distrito": "Huamantanga"
  },
  {
    "ubigeo": "150404",
    "departamento": "Lima",
    "provincia": "Canta",
    "distrito": "Huaros"
  },
  {
    "ubigeo": "150405",
    "departamento": "Lima",
    "provincia": "Canta",
    "distrito": "Lachaqui"
  },
  {
    "ubigeo": "150406",
    "departamento": "Lima",
    "provincia": "Canta",
    "distrito": "San Buenaventura"
  },
  {
    "ubigeo": "150407",
    "departamento": "Lima",
    "provincia": "Canta",
    "distrito": "Santa Rosa de Quives"
  },
  {
    "ubigeo": "150501",
    "departamento": "Lima",
    "provincia": "Cañete",
    "distrito": "San Vicente de Cañete"
  },
  {
    "ubigeo": "150502",
    "departamento": "Lima",
    "provincia": "Cañete",
    "distrito": "Asia"
  },
  {
    "ubigeo": "150503",
    "departamento": "Lima",
    "provincia": "Cañete",
    "distrito": "Calango"
  },
  {
    "ubigeo": "150504",
    "departamento": "Lima",
    "provincia": "Cañete",
    "distrito": "Cerro Azul"
  },
  {
    "ubigeo": "150505",
    "departamento": "Lima",
    "provincia": "Cañete",
    "distrito": "Chilca"
  },
  {
    "ubigeo": "150506",
    "departamento": "Lima",
    "provincia": "Cañete",
    "distrito": "Coayllo"
  },
  {
    "ubigeo": "150507",
    "departamento": "Lima",
    "provincia": "Cañete",
    "distrito": "Imperial"
  },
  {
    "ubigeo": "150508",
    "departamento": "Lima",
    "provincia": "Cañete",
    "distrito": "Lunahuana"
  },
  {
    "ubigeo": "150509",
    "departamento": "Lima",
    "provincia": "Cañete",
    "distrito": "Mala"
  },
  {
    "ubigeo": "150510",
    "departamento": "Lima",
    "provincia": "Cañete",
    "distrito": "Nuevo Imperial"
  },
  {
    "ubigeo": "150511",
    "departamento": "Lima",
    "provincia": "Cañete",
    "distrito": "Pacaran"
  },
  {
    "ubigeo": "150512",
    "departamento": "Lima",
    "provincia": "Cañete",
    "distrito": "Quilmana"
  },
  {
    "ubigeo": "150513",
    "departamento": "Lima",
    "provincia": "Cañete",
    "distrito": "San Antonio"
  },
  {
    "ubigeo": "150514",
    "departamento": "Lima",
    "provincia": "Cañete",
    "distrito": "San Luis"
  },
  {
    "ubigeo": "150515",
    "departamento": "Lima",
    "provincia": "Cañete",
    "distrito": "Santa Cruz de Flores"
  },
  {
    "ubigeo": "150516",
    "departamento": "Lima",
    "provincia": "Cañete",
    "distrito": "Zúñiga"
  },
  {
    "ubigeo": "150601",
    "departamento": "Lima",
    "provincia": "Huaral",
    "distrito": "Huaral"
  },
  {
    "ubigeo": "150602",
    "departamento": "Lima",
    "provincia": "Huaral",
    "distrito": "Atavillos Alto"
  },
  {
    "ubigeo": "150603",
    "departamento": "Lima",
    "provincia": "Huaral",
    "distrito": "Atavillos Bajo"
  },
  {
    "ubigeo": "150604",
    "departamento": "Lima",
    "provincia": "Huaral",
    "distrito": "Aucallama"
  },
  {
    "ubigeo": "150605",
    "departamento": "Lima",
    "provincia": "Huaral",
    "distrito": "Chancay"
  },
  {
    "ubigeo": "150606",
    "departamento": "Lima",
    "provincia": "Huaral",
    "distrito": "Ihuari"
  },
  {
    "ubigeo": "150607",
    "departamento": "Lima",
    "provincia": "Huaral",
    "distrito": "Lampian"
  },
  {
    "ubigeo": "150608",
    "departamento": "Lima",
    "provincia": "Huaral",
    "distrito": "Pacaraos"
  },
  {
    "ubigeo": "150609",
    "departamento": "Lima",
    "provincia": "Huaral",
    "distrito": "San Miguel de Acos"
  },
  {
    "ubigeo": "150610",
    "departamento": "Lima",
    "provincia": "Huaral",
    "distrito": "Santa Cruz de Andamarca"
  },
  {
    "ubigeo": "150611",
    "departamento": "Lima",
    "provincia": "Huaral",
    "distrito": "Sumbilca"
  },
  {
    "ubigeo": "150612",
    "departamento": "Lima",
    "provincia": "Huaral",
    "distrito": "Veintisiete de Noviembre"
  },
  {
    "ubigeo": "150701",
    "departamento": "Lima",
    "provincia": "Huarochiri",
    "distrito": "Matucana"
  },
  {
    "ubigeo": "150702",
    "departamento": "Lima",
    "provincia": "Huarochiri",
    "distrito": "Antioquia"
  },
  {
    "ubigeo": "150703",
    "departamento": "Lima",
    "provincia": "Huarochiri",
    "distrito": "Callahuanca"
  },
  {
    "ubigeo": "150704",
    "departamento": "Lima",
    "provincia": "Huarochiri",
    "distrito": "Carampoma"
  },
  {
    "ubigeo": "150705",
    "departamento": "Lima",
    "provincia": "Huarochiri",
    "distrito": "Chicla"
  },
  {
    "ubigeo": "150706",
    "departamento": "Lima",
    "provincia": "Huarochiri",
    "distrito": "Cuenca"
  },
  {
    "ubigeo": "150707",
    "departamento": "Lima",
    "provincia": "Huarochiri",
    "distrito": "Huachupampa"
  },
  {
    "ubigeo": "150708",
    "departamento": "Lima",
    "provincia": "Huarochiri",
    "distrito": "Huanza"
  },
  {
    "ubigeo": "150709",
    "departamento": "Lima",
    "provincia": "Huarochiri",
    "distrito": "Huarochiri"
  },
  {
    "ubigeo": "150710",
    "departamento": "Lima",
    "provincia": "Huarochiri",
    "distrito": "Lahuaytambo"
  },
  {
    "ubigeo": "150711",
    "departamento": "Lima",
    "provincia": "Huarochiri",
    "distrito": "Langa"
  },
  {
    "ubigeo": "150712",
    "departamento": "Lima",
    "provincia": "Huarochiri",
    "distrito": "Laraos"
  },
  {
    "ubigeo": "150713",
    "departamento": "Lima",
    "provincia": "Huarochiri",
    "distrito": "Mariatana"
  },
  {
    "ubigeo": "150714",
    "departamento": "Lima",
    "provincia": "Huarochiri",
    "distrito": "Ricardo Palma"
  },
  {
    "ubigeo": "150715",
    "departamento": "Lima",
    "provincia": "Huarochiri",
    "distrito": "San Andrés de Tupicocha"
  },
  {
    "ubigeo": "150716",
    "departamento": "Lima",
    "provincia": "Huarochiri",
    "distrito": "San Antonio"
  },
  {
    "ubigeo": "150717",
    "departamento": "Lima",
    "provincia": "Huarochiri",
    "distrito": "San Bartolomé"
  },
  {
    "ubigeo": "150718",
    "departamento": "Lima",
    "provincia": "Huarochiri",
    "distrito": "San Damian"
  },
  {
    "ubigeo": "150719",
    "departamento": "Lima",
    "provincia": "Huarochiri",
    "distrito": "San Juan de Iris"
  },
  {
    "ubigeo": "150720",
    "departamento": "Lima",
    "provincia": "Huarochiri",
    "distrito": "San Juan de Tantaranche"
  },
  {
    "ubigeo": "150721",
    "departamento": "Lima",
    "provincia": "Huarochiri",
    "distrito": "San Lorenzo de Quinti"
  },
  {
    "ubigeo": "150722",
    "departamento": "Lima",
    "provincia": "Huarochiri",
    "distrito": "San Mateo"
  },
  {
    "ubigeo": "150723",
    "departamento": "Lima",
    "provincia": "Huarochiri",
    "distrito": "San Mateo de Otao"
  },
  {
    "ubigeo": "150724",
    "departamento": "Lima",
    "provincia": "Huarochiri",
    "distrito": "San Pedro de Casta"
  },
  {
    "ubigeo": "150725",
    "departamento": "Lima",
    "provincia": "Huarochiri",
    "distrito": "San Pedro de Huancayre"
  },
  {
    "ubigeo": "150726",
    "departamento": "Lima",
    "provincia": "Huarochiri",
    "distrito": "Sangallaya"
  },
  {
    "ubigeo": "150727",
    "departamento": "Lima",
    "provincia": "Huarochiri",
    "distrito": "Santa Cruz de Cocachacra"
  },
  {
    "ubigeo": "150728",
    "departamento": "Lima",
    "provincia": "Huarochiri",
    "distrito": "Santa Eulalia"
  },
  {
    "ubigeo": "150729",
    "departamento": "Lima",
    "provincia": "Huarochiri",
    "distrito": "Santiago de Anchucaya"
  },
  {
    "ubigeo": "150730",
    "departamento": "Lima",
    "provincia": "Huarochiri",
    "distrito": "Santiago de Tuna"
  },
  {
    "ubigeo": "150731",
    "departamento": "Lima",
    "provincia": "Huarochiri",
    "distrito": "Santo Domingo de los Olleros"
  },
  {
    "ubigeo": "150732",
    "departamento": "Lima",
    "provincia": "Huarochiri",
    "distrito": "Surco"
  },
  {
    "ubigeo": "150801",
    "departamento": "Lima",
    "provincia": "Huaura",
    "distrito": "Huacho"
  },
  {
    "ubigeo": "150802",
    "departamento": "Lima",
    "provincia": "Huaura",
    "distrito": "Ambar"
  },
  {
    "ubigeo": "150803",
    "departamento": "Lima",
    "provincia": "Huaura",
    "distrito": "Caleta de Carquin"
  },
  {
    "ubigeo": "150804",
    "departamento": "Lima",
    "provincia": "Huaura",
    "distrito": "Checras"
  },
  {
    "ubigeo": "150805",
    "departamento": "Lima",
    "provincia": "Huaura",
    "distrito": "Hualmay"
  },
  {
    "ubigeo": "150806",
    "departamento": "Lima",
    "provincia": "Huaura",
    "distrito": "Huaura"
  },
  {
    "ubigeo": "150807",
    "departamento": "Lima",
    "provincia": "Huaura",
    "distrito": "Leoncio Prado"
  },
  {
    "ubigeo": "150808",
    "departamento": "Lima",
    "provincia": "Huaura",
    "distrito": "Paccho"
  },
  {
    "ubigeo": "150809",
    "departamento": "Lima",
    "provincia": "Huaura",
    "distrito": "Santa Leonor"
  },
  {
    "ubigeo": "150810",
    "departamento": "Lima",
    "provincia": "Huaura",
    "distrito": "Santa Maria"
  },
  {
    "ubigeo": "150811",
    "departamento": "Lima",
    "provincia": "Huaura",
    "distrito": "Sayan"
  },
  {
    "ubigeo": "150812",
    "departamento": "Lima",
    "provincia": "Huaura",
    "distrito": "Vegueta"
  },
  {
    "ubigeo": "150901",
    "departamento": "Lima",
    "provincia": "Oyon",
    "distrito": "Oyon"
  },
  {
    "ubigeo": "150902",
    "departamento": "Lima",
    "provincia": "Oyon",
    "distrito": "Andajes"
  },
  {
    "ubigeo": "150903",
    "departamento": "Lima",
    "provincia": "Oyon",
    "distrito": "Caujul"
  },
  {
    "ubigeo": "150904",
    "departamento": "Lima",
    "provincia": "Oyon",
    "distrito": "Cochamarca"
  },
  {
    "ubigeo": "150905",
    "departamento": "Lima",
    "provincia": "Oyon",
    "distrito": "Navan"
  },
  {
    "ubigeo": "150906",
    "departamento": "Lima",
    "provincia": "Oyon",
    "distrito": "Pachangara"
  },
  {
    "ubigeo": "151001",
    "departamento": "Lima",
    "provincia": "Yauyos",
    "distrito": "Yauyos"
  },
  {
    "ubigeo": "151002",
    "departamento": "Lima",
    "provincia": "Yauyos",
    "distrito": "Alis"
  },
  {
    "ubigeo": "151003",
    "departamento": "Lima",
    "provincia": "Yauyos",
    "distrito": "Ayauca"
  },
  {
    "ubigeo": "151004",
    "departamento": "Lima",
    "provincia": "Yauyos",
    "distrito": "Ayaviri"
  },
  {
    "ubigeo": "151005",
    "departamento": "Lima",
    "provincia": "Yauyos",
    "distrito": "Azángaro"
  },
  {
    "ubigeo": "151006",
    "departamento": "Lima",
    "provincia": "Yauyos",
    "distrito": "Cacra"
  },
  {
    "ubigeo": "151007",
    "departamento": "Lima",
    "provincia": "Yauyos",
    "distrito": "Carania"
  },
  {
    "ubigeo": "151008",
    "departamento": "Lima",
    "provincia": "Yauyos",
    "distrito": "Catahuasi"
  },
  {
    "ubigeo": "151009",
    "departamento": "Lima",
    "provincia": "Yauyos",
    "distrito": "Chocos"
  },
  {
    "ubigeo": "151010",
    "departamento": "Lima",
    "provincia": "Yauyos",
    "distrito": "Cochas"
  },
  {
    "ubigeo": "151011",
    "departamento": "Lima",
    "provincia": "Yauyos",
    "distrito": "Colonia"
  },
  {
    "ubigeo": "151012",
    "departamento": "Lima",
    "provincia": "Yauyos",
    "distrito": "Hongos"
  },
  {
    "ubigeo": "151013",
    "departamento": "Lima",
    "provincia": "Yauyos",
    "distrito": "Huampara"
  },
  {
    "ubigeo": "151014",
    "departamento": "Lima",
    "provincia": "Yauyos",
    "distrito": "Huancaya"
  },
  {
    "ubigeo": "151015",
    "departamento": "Lima",
    "provincia": "Yauyos",
    "distrito": "Huangascar"
  },
  {
    "ubigeo": "151016",
    "departamento": "Lima",
    "provincia": "Yauyos",
    "distrito": "Huantan"
  },
  {
    "ubigeo": "151017",
    "departamento": "Lima",
    "provincia": "Yauyos",
    "distrito": "Huañec"
  },
  {
    "ubigeo": "151018",
    "departamento": "Lima",
    "provincia": "Yauyos",
    "distrito": "Laraos"
  },
  {
    "ubigeo": "151019",
    "departamento": "Lima",
    "provincia": "Yauyos",
    "distrito": "Lincha"
  },
  {
    "ubigeo": "151020",
    "departamento": "Lima",
    "provincia": "Yauyos",
    "distrito": "Madean"
  },
  {
    "ubigeo": "151021",
    "departamento": "Lima",
    "provincia": "Yauyos",
    "distrito": "Miraflores"
  },
  {
    "ubigeo": "151022",
    "departamento": "Lima",
    "provincia": "Yauyos",
    "distrito": "Omas"
  },
  {
    "ubigeo": "151023",
    "departamento": "Lima",
    "provincia": "Yauyos",
    "distrito": "Putinza"
  },
  {
    "ubigeo": "151024",
    "departamento": "Lima",
    "provincia": "Yauyos",
    "distrito": "Quinches"
  },
  {
    "ubigeo": "151025",
    "departamento": "Lima",
    "provincia": "Yauyos",
    "distrito": "Quinocay"
  },
  {
    "ubigeo": "151026",
    "departamento": "Lima",
    "provincia": "Yauyos",
    "distrito": "San Joaquín"
  },
  {
    "ubigeo": "151027",
    "departamento": "Lima",
    "provincia": "Yauyos",
    "distrito": "San Pedro de Pilas"
  },
  {
    "ubigeo": "151028",
    "departamento": "Lima",
    "provincia": "Yauyos",
    "distrito": "Tanta"
  },
  {
    "ubigeo": "151029",
    "departamento": "Lima",
    "provincia": "Yauyos",
    "distrito": "Tauripampa"
  },
  {
    "ubigeo": "151030",
    "departamento": "Lima",
    "provincia": "Yauyos",
    "distrito": "Tomas"
  },
  {
    "ubigeo": "151031",
    "departamento": "Lima",
    "provincia": "Yauyos",
    "distrito": "Tupe"
  },
  {
    "ubigeo": "151032",
    "departamento": "Lima",
    "provincia": "Yauyos",
    "distrito": "Viñac"
  },
  {
    "ubigeo": "151033",
    "departamento": "Lima",
    "provincia": "Yauyos",
    "distrito": "Vitis"
  },
  {
    "ubigeo": "160101",
    "departamento": "Loreto",
    "provincia": "Maynas",
    "distrito": "Iquitos"
  },
  {
    "ubigeo": "160102",
    "departamento": "Loreto",
    "provincia": "Maynas",
    "distrito": "Alto Nanay"
  },
  {
    "ubigeo": "160103",
    "departamento": "Loreto",
    "provincia": "Maynas",
    "distrito": "Fernando Lores"
  },
  {
    "ubigeo": "160104",
    "departamento": "Loreto",
    "provincia": "Maynas",
    "distrito": "Indiana"
  },
  {
    "ubigeo": "160105",
    "departamento": "Loreto",
    "provincia": "Maynas",
    "distrito": "Las Amazonas"
  },
  {
    "ubigeo": "160106",
    "departamento": "Loreto",
    "provincia": "Maynas",
    "distrito": "Mazan"
  },
  {
    "ubigeo": "160107",
    "departamento": "Loreto",
    "provincia": "Maynas",
    "distrito": "Napo"
  },
  {
    "ubigeo": "160108",
    "departamento": "Loreto",
    "provincia": "Maynas",
    "distrito": "Punchana"
  },
  {
    "ubigeo": "160110",
    "departamento": "Loreto",
    "provincia": "Maynas",
    "distrito": "Torres Causana"
  },
  {
    "ubigeo": "160112",
    "departamento": "Loreto",
    "provincia": "Maynas",
    "distrito": "Belén"
  },
  {
    "ubigeo": "160113",
    "departamento": "Loreto",
    "provincia": "Maynas",
    "distrito": "San Juan Bautista"
  },
  {
    "ubigeo": "160201",
    "departamento": "Loreto",
    "provincia": "Alto Amazonas",
    "distrito": "Yurimaguas"
  },
  {
    "ubigeo": "160202",
    "departamento": "Loreto",
    "provincia": "Alto Amazonas",
    "distrito": "Balsapuerto"
  },
  {
    "ubigeo": "160205",
    "departamento": "Loreto",
    "provincia": "Alto Amazonas",
    "distrito": "Jeberos"
  },
  {
    "ubigeo": "160206",
    "departamento": "Loreto",
    "provincia": "Alto Amazonas",
    "distrito": "Lagunas"
  },
  {
    "ubigeo": "160210",
    "departamento": "Loreto",
    "provincia": "Alto Amazonas",
    "distrito": "Santa Cruz"
  },
  {
    "ubigeo": "160211",
    "departamento": "Loreto",
    "provincia": "Alto Amazonas",
    "distrito": "Teniente Cesar López Rojas"
  },
  {
    "ubigeo": "160301",
    "departamento": "Loreto",
    "provincia": "Loreto",
    "distrito": "Nauta"
  },
  {
    "ubigeo": "160302",
    "departamento": "Loreto",
    "provincia": "Loreto",
    "distrito": "Parinari"
  },
  {
    "ubigeo": "160303",
    "departamento": "Loreto",
    "provincia": "Loreto",
    "distrito": "Tigre"
  },
  {
    "ubigeo": "160304",
    "departamento": "Loreto",
    "provincia": "Loreto",
    "distrito": "Trompeteros"
  },
  {
    "ubigeo": "160305",
    "departamento": "Loreto",
    "provincia": "Loreto",
    "distrito": "Urarinas"
  },
  {
    "ubigeo": "160401",
    "departamento": "Loreto",
    "provincia": "Mariscal Ramón Castilla",
    "distrito": "Ramón Castilla"
  },
  {
    "ubigeo": "160402",
    "departamento": "Loreto",
    "provincia": "Mariscal Ramón Castilla",
    "distrito": "Pebas"
  },
  {
    "ubigeo": "160403",
    "departamento": "Loreto",
    "provincia": "Mariscal Ramón Castilla",
    "distrito": "Yavari"
  },
  {
    "ubigeo": "160404",
    "departamento": "Loreto",
    "provincia": "Mariscal Ramón Castilla",
    "distrito": "San Pablo"
  },
  {
    "ubigeo": "160501",
    "departamento": "Loreto",
    "provincia": "Requena",
    "distrito": "Requena"
  },
  {
    "ubigeo": "160502",
    "departamento": "Loreto",
    "provincia": "Requena",
    "distrito": "Alto Tapiche"
  },
  {
    "ubigeo": "160503",
    "departamento": "Loreto",
    "provincia": "Requena",
    "distrito": "Capelo"
  },
  {
    "ubigeo": "160504",
    "departamento": "Loreto",
    "provincia": "Requena",
    "distrito": "Emilio San Martín"
  },
  {
    "ubigeo": "160505",
    "departamento": "Loreto",
    "provincia": "Requena",
    "distrito": "Maquia"
  },
  {
    "ubigeo": "160506",
    "departamento": "Loreto",
    "provincia": "Requena",
    "distrito": "Puinahua"
  },
  {
    "ubigeo": "160507",
    "departamento": "Loreto",
    "provincia": "Requena",
    "distrito": "Saquena"
  },
  {
    "ubigeo": "160508",
    "departamento": "Loreto",
    "provincia": "Requena",
    "distrito": "Soplin"
  },
  {
    "ubigeo": "160509",
    "departamento": "Loreto",
    "provincia": "Requena",
    "distrito": "Tapiche"
  },
  {
    "ubigeo": "160510",
    "departamento": "Loreto",
    "provincia": "Requena",
    "distrito": "Jenaro Herrera"
  },
  {
    "ubigeo": "160511",
    "departamento": "Loreto",
    "provincia": "Requena",
    "distrito": "Yaquerana"
  },
  {
    "ubigeo": "160601",
    "departamento": "Loreto",
    "provincia": "Ucayali",
    "distrito": "Contamana"
  },
  {
    "ubigeo": "160602",
    "departamento": "Loreto",
    "provincia": "Ucayali",
    "distrito": "Inahuaya"
  },
  {
    "ubigeo": "160603",
    "departamento": "Loreto",
    "provincia": "Ucayali",
    "distrito": "Padre Marquez"
  },
  {
    "ubigeo": "160604",
    "departamento": "Loreto",
    "provincia": "Ucayali",
    "distrito": "Pampa Hermosa"
  },
  {
    "ubigeo": "160605",
    "departamento": "Loreto",
    "provincia": "Ucayali",
    "distrito": "Sarayacu"
  },
  {
    "ubigeo": "160606",
    "departamento": "Loreto",
    "provincia": "Ucayali",
    "distrito": "Vargas Guerra"
  },
  {
    "ubigeo": "160701",
    "departamento": "Loreto",
    "provincia": "Datem del Marañon",
    "distrito": "Barranca"
  },
  {
    "ubigeo": "160702",
    "departamento": "Loreto",
    "provincia": "Datem del Marañon",
    "distrito": "Cahuapanas"
  },
  {
    "ubigeo": "160703",
    "departamento": "Loreto",
    "provincia": "Datem del Marañon",
    "distrito": "Manseriche"
  },
  {
    "ubigeo": "160704",
    "departamento": "Loreto",
    "provincia": "Datem del Marañon",
    "distrito": "Morona"
  },
  {
    "ubigeo": "160705",
    "departamento": "Loreto",
    "provincia": "Datem del Marañon",
    "distrito": "Pastaza"
  },
  {
    "ubigeo": "160706",
    "departamento": "Loreto",
    "provincia": "Datem del Marañon",
    "distrito": "Andoas"
  },
  {
    "ubigeo": "160801",
    "departamento": "Loreto",
    "provincia": "Maynas",
    "distrito": "Putumayo"
  },
  {
    "ubigeo": "160802",
    "departamento": "Loreto",
    "provincia": "Maynas",
    "distrito": "Rosa Panduro"
  },
  {
    "ubigeo": "160803",
    "departamento": "Loreto",
    "provincia": "Maynas",
    "distrito": "Teniente Manuel Clavero"
  },
  {
    "ubigeo": "160804",
    "departamento": "Loreto",
    "provincia": "Maynas",
    "distrito": "Yaguas"
  },
  {
    "ubigeo": "170101",
    "departamento": "Madre de Dios",
    "provincia": "Tambopata",
    "distrito": "Tambopata"
  },
  {
    "ubigeo": "170102",
    "departamento": "Madre de Dios",
    "provincia": "Tambopata",
    "distrito": "Inambari"
  },
  {
    "ubigeo": "170103",
    "departamento": "Madre de Dios",
    "provincia": "Tambopata",
    "distrito": "Las Piedras"
  },
  {
    "ubigeo": "170104",
    "departamento": "Madre de Dios",
    "provincia": "Tambopata",
    "distrito": "Laberinto"
  },
  {
    "ubigeo": "170201",
    "departamento": "Madre de Dios",
    "provincia": "Manu",
    "distrito": "Manu"
  },
  {
    "ubigeo": "170202",
    "departamento": "Madre de Dios",
    "provincia": "Manu",
    "distrito": "Fitzcarrald"
  },
  {
    "ubigeo": "170203",
    "departamento": "Madre de Dios",
    "provincia": "Manu",
    "distrito": "Madre de Dios"
  },
  {
    "ubigeo": "170204",
    "departamento": "Madre de Dios",
    "provincia": "Manu",
    "distrito": "Huepetuhe"
  },
  {
    "ubigeo": "170301",
    "departamento": "Madre de Dios",
    "provincia": "Tahuamanu",
    "distrito": "Iñapari"
  },
  {
    "ubigeo": "170302",
    "departamento": "Madre de Dios",
    "provincia": "Tahuamanu",
    "distrito": "Iberia"
  },
  {
    "ubigeo": "170303",
    "departamento": "Madre de Dios",
    "provincia": "Tahuamanu",
    "distrito": "Tahuamanu"
  },
  {
    "ubigeo": "180101",
    "departamento": "Moquegua",
    "provincia": "Mariscal Nieto",
    "distrito": "Moquegua"
  },
  {
    "ubigeo": "180102",
    "departamento": "Moquegua",
    "provincia": "Mariscal Nieto",
    "distrito": "Carumas"
  },
  {
    "ubigeo": "180103",
    "departamento": "Moquegua",
    "provincia": "Mariscal Nieto",
    "distrito": "Cuchumbaya"
  },
  {
    "ubigeo": "180104",
    "departamento": "Moquegua",
    "provincia": "Mariscal Nieto",
    "distrito": "Samegua"
  },
  {
    "ubigeo": "180105",
    "departamento": "Moquegua",
    "provincia": "Mariscal Nieto",
    "distrito": "San Cristóbal"
  },
  {
    "ubigeo": "180106",
    "departamento": "Moquegua",
    "provincia": "Mariscal Nieto",
    "distrito": "Torata"
  },
  {
    "ubigeo": "180201",
    "departamento": "Moquegua",
    "provincia": "General Sánchez Cerro",
    "distrito": "Omate"
  },
  {
    "ubigeo": "180202",
    "departamento": "Moquegua",
    "provincia": "General Sánchez Cerro",
    "distrito": "Chojata"
  },
  {
    "ubigeo": "180203",
    "departamento": "Moquegua",
    "provincia": "General Sánchez Cerro",
    "distrito": "Coalaque"
  },
  {
    "ubigeo": "180204",
    "departamento": "Moquegua",
    "provincia": "General Sánchez Cerro",
    "distrito": "Ichuña"
  },
  {
    "ubigeo": "180205",
    "departamento": "Moquegua",
    "provincia": "General Sánchez Cerro",
    "distrito": "La Capilla"
  },
  {
    "ubigeo": "180206",
    "departamento": "Moquegua",
    "provincia": "General Sánchez Cerro",
    "distrito": "Lloque"
  },
  {
    "ubigeo": "180207",
    "departamento": "Moquegua",
    "provincia": "General Sánchez Cerro",
    "distrito": "Matalaque"
  },
  {
    "ubigeo": "180208",
    "departamento": "Moquegua",
    "provincia": "General Sánchez Cerro",
    "distrito": "Puquina"
  },
  {
    "ubigeo": "180209",
    "departamento": "Moquegua",
    "provincia": "General Sánchez Cerro",
    "distrito": "Quinistaquillas"
  },
  {
    "ubigeo": "180210",
    "departamento": "Moquegua",
    "provincia": "General Sánchez Cerro",
    "distrito": "Ubinas"
  },
  {
    "ubigeo": "180211",
    "departamento": "Moquegua",
    "provincia": "General Sánchez Cerro",
    "distrito": "Yunga"
  },
  {
    "ubigeo": "180301",
    "departamento": "Moquegua",
    "provincia": "Ilo",
    "distrito": "Ilo"
  },
  {
    "ubigeo": "180302",
    "departamento": "Moquegua",
    "provincia": "Ilo",
    "distrito": "El Algarrobal"
  },
  {
    "ubigeo": "180303",
    "departamento": "Moquegua",
    "provincia": "Ilo",
    "distrito": "Pacocha"
  },
  {
    "ubigeo": "190101",
    "departamento": "Pasco",
    "provincia": "Pasco",
    "distrito": "Chaupimarca"
  },
  {
    "ubigeo": "190102",
    "departamento": "Pasco",
    "provincia": "Pasco",
    "distrito": "Huachon"
  },
  {
    "ubigeo": "190103",
    "departamento": "Pasco",
    "provincia": "Pasco",
    "distrito": "Huariaca"
  },
  {
    "ubigeo": "190104",
    "departamento": "Pasco",
    "provincia": "Pasco",
    "distrito": "Huayllay"
  },
  {
    "ubigeo": "190105",
    "departamento": "Pasco",
    "provincia": "Pasco",
    "distrito": "Ninacaca"
  },
  {
    "ubigeo": "190106",
    "departamento": "Pasco",
    "provincia": "Pasco",
    "distrito": "Pallanchacra"
  },
  {
    "ubigeo": "190107",
    "departamento": "Pasco",
    "provincia": "Pasco",
    "distrito": "Paucartambo"
  },
  {
    "ubigeo": "190108",
    "departamento": "Pasco",
    "provincia": "Pasco",
    "distrito": "San Francisco de Asís de Yarusyacan"
  },
  {
    "ubigeo": "190109",
    "departamento": "Pasco",
    "provincia": "Pasco",
    "distrito": "Simon Bolivar"
  },
  {
    "ubigeo": "190110",
    "departamento": "Pasco",
    "provincia": "Pasco",
    "distrito": "Ticlacayan"
  },
  {
    "ubigeo": "190111",
    "departamento": "Pasco",
    "provincia": "Pasco",
    "distrito": "Tinyahuarco"
  },
  {
    "ubigeo": "190112",
    "departamento": "Pasco",
    "provincia": "Pasco",
    "distrito": "Vicco"
  },
  {
    "ubigeo": "190113",
    "departamento": "Pasco",
    "provincia": "Pasco",
    "distrito": "Yanacancha"
  },
  {
    "ubigeo": "190201",
    "departamento": "Pasco",
    "provincia": "Daniel Alcides Carrión",
    "distrito": "Yanahuanca"
  },
  {
    "ubigeo": "190202",
    "departamento": "Pasco",
    "provincia": "Daniel Alcides Carrión",
    "distrito": "Chacayan"
  },
  {
    "ubigeo": "190203",
    "departamento": "Pasco",
    "provincia": "Daniel Alcides Carrión",
    "distrito": "Goyllarisquizga"
  },
  {
    "ubigeo": "190204",
    "departamento": "Pasco",
    "provincia": "Daniel Alcides Carrión",
    "distrito": "Paucar"
  },
  {
    "ubigeo": "190205",
    "departamento": "Pasco",
    "provincia": "Daniel Alcides Carrión",
    "distrito": "San Pedro de Pillao"
  },
  {
    "ubigeo": "190206",
    "departamento": "Pasco",
    "provincia": "Daniel Alcides Carrión",
    "distrito": "Santa Ana de Tusi"
  },
  {
    "ubigeo": "190207",
    "departamento": "Pasco",
    "provincia": "Daniel Alcides Carrión",
    "distrito": "Tapuc"
  },
  {
    "ubigeo": "190208",
    "departamento": "Pasco",
    "provincia": "Daniel Alcides Carrión",
    "distrito": "Vilcabamba"
  },
  {
    "ubigeo": "190301",
    "departamento": "Pasco",
    "provincia": "Oxapampa",
    "distrito": "Oxapampa"
  },
  {
    "ubigeo": "190302",
    "departamento": "Pasco",
    "provincia": "Oxapampa",
    "distrito": "Chontabamba"
  },
  {
    "ubigeo": "190303",
    "departamento": "Pasco",
    "provincia": "Oxapampa",
    "distrito": "Huancabamba"
  },
  {
    "ubigeo": "190304",
    "departamento": "Pasco",
    "provincia": "Oxapampa",
    "distrito": "Palcazu"
  },
  {
    "ubigeo": "190305",
    "departamento": "Pasco",
    "provincia": "Oxapampa",
    "distrito": "Pozuzo"
  },
  {
    "ubigeo": "190306",
    "departamento": "Pasco",
    "provincia": "Oxapampa",
    "distrito": "Puerto Bermúdez"
  },
  {
    "ubigeo": "190307",
    "departamento": "Pasco",
    "provincia": "Oxapampa",
    "distrito": "Villa Rica"
  },
  {
    "ubigeo": "190308",
    "departamento": "Pasco",
    "provincia": "Oxapampa",
    "distrito": "Constitución"
  },
  {
    "ubigeo": "200101",
    "departamento": "Piura",
    "provincia": "Piura",
    "distrito": "Piura"
  },
  {
    "ubigeo": "200104",
    "departamento": "Piura",
    "provincia": "Piura",
    "distrito": "Castilla"
  },
  {
    "ubigeo": "200105",
    "departamento": "Piura",
    "provincia": "Piura",
    "distrito": "Catacaos"
  },
  {
    "ubigeo": "200107",
    "departamento": "Piura",
    "provincia": "Piura",
    "distrito": "Cura Mori"
  },
  {
    "ubigeo": "200108",
    "departamento": "Piura",
    "provincia": "Piura",
    "distrito": "El Tallan"
  },
  {
    "ubigeo": "200109",
    "departamento": "Piura",
    "provincia": "Piura",
    "distrito": "La Arena"
  },
  {
    "ubigeo": "200110",
    "departamento": "Piura",
    "provincia": "Piura",
    "distrito": "La Union"
  },
  {
    "ubigeo": "200111",
    "departamento": "Piura",
    "provincia": "Piura",
    "distrito": "Las Lomas"
  },
  {
    "ubigeo": "200114",
    "departamento": "Piura",
    "provincia": "Piura",
    "distrito": "Tambo Grande"
  },
  {
    "ubigeo": "200115",
    "departamento": "Piura",
    "provincia": "Piura",
    "distrito": "26 de Octubre"
  },
  {
    "ubigeo": "200201",
    "departamento": "Piura",
    "provincia": "Ayabaca",
    "distrito": "Ayabaca"
  },
  {
    "ubigeo": "200202",
    "departamento": "Piura",
    "provincia": "Ayabaca",
    "distrito": "Frias"
  },
  {
    "ubigeo": "200203",
    "departamento": "Piura",
    "provincia": "Ayabaca",
    "distrito": "Jilili"
  },
  {
    "ubigeo": "200204",
    "departamento": "Piura",
    "provincia": "Ayabaca",
    "distrito": "Lagunas"
  },
  {
    "ubigeo": "200205",
    "departamento": "Piura",
    "provincia": "Ayabaca",
    "distrito": "Montero"
  },
  {
    "ubigeo": "200206",
    "departamento": "Piura",
    "provincia": "Ayabaca",
    "distrito": "Pacaipampa"
  },
  {
    "ubigeo": "200207",
    "departamento": "Piura",
    "provincia": "Ayabaca",
    "distrito": "Paimas"
  },
  {
    "ubigeo": "200208",
    "departamento": "Piura",
    "provincia": "Ayabaca",
    "distrito": "Sapillica"
  },
  {
    "ubigeo": "200209",
    "departamento": "Piura",
    "provincia": "Ayabaca",
    "distrito": "Sicchez"
  },
  {
    "ubigeo": "200210",
    "departamento": "Piura",
    "provincia": "Ayabaca",
    "distrito": "Suyo"
  },
  {
    "ubigeo": "200301",
    "departamento": "Piura",
    "provincia": "Huancabamba",
    "distrito": "Huancabamba"
  },
  {
    "ubigeo": "200302",
    "departamento": "Piura",
    "provincia": "Huancabamba",
    "distrito": "Canchaque"
  },
  {
    "ubigeo": "200303",
    "departamento": "Piura",
    "provincia": "Huancabamba",
    "distrito": "El Carmen de La Frontera"
  },
  {
    "ubigeo": "200304",
    "departamento": "Piura",
    "provincia": "Huancabamba",
    "distrito": "Huarmaca"
  },
  {
    "ubigeo": "200305",
    "departamento": "Piura",
    "provincia": "Huancabamba",
    "distrito": "Lalaquiz"
  },
  {
    "ubigeo": "200306",
    "departamento": "Piura",
    "provincia": "Huancabamba",
    "distrito": "San Miguel de El Faique"
  },
  {
    "ubigeo": "200307",
    "departamento": "Piura",
    "provincia": "Huancabamba",
    "distrito": "Sondor"
  },
  {
    "ubigeo": "200308",
    "departamento": "Piura",
    "provincia": "Huancabamba",
    "distrito": "Sondorillo"
  },
  {
    "ubigeo": "200401",
    "departamento": "Piura",
    "provincia": "Morropon",
    "distrito": "Chulucanas"
  },
  {
    "ubigeo": "200402",
    "departamento": "Piura",
    "provincia": "Morropon",
    "distrito": "Buenos Aires"
  },
  {
    "ubigeo": "200403",
    "departamento": "Piura",
    "provincia": "Morropon",
    "distrito": "Chalaco"
  },
  {
    "ubigeo": "200404",
    "departamento": "Piura",
    "provincia": "Morropon",
    "distrito": "La Matanza"
  },
  {
    "ubigeo": "200405",
    "departamento": "Piura",
    "provincia": "Morropon",
    "distrito": "Morropon"
  },
  {
    "ubigeo": "200406",
    "departamento": "Piura",
    "provincia": "Morropon",
    "distrito": "Salitral"
  },
  {
    "ubigeo": "200407",
    "departamento": "Piura",
    "provincia": "Morropon",
    "distrito": "San Juan de Bigote"
  },
  {
    "ubigeo": "200408",
    "departamento": "Piura",
    "provincia": "Morropon",
    "distrito": "Santa Catalina de Mossa"
  },
  {
    "ubigeo": "200409",
    "departamento": "Piura",
    "provincia": "Morropon",
    "distrito": "Santo Domingo"
  },
  {
    "ubigeo": "200410",
    "departamento": "Piura",
    "provincia": "Morropon",
    "distrito": "Yamango"
  },
  {
    "ubigeo": "200501",
    "departamento": "Piura",
    "provincia": "Paita",
    "distrito": "Paita"
  },
  {
    "ubigeo": "200502",
    "departamento": "Piura",
    "provincia": "Paita",
    "distrito": "Amotape"
  },
  {
    "ubigeo": "200503",
    "departamento": "Piura",
    "provincia": "Paita",
    "distrito": "Arenal"
  },
  {
    "ubigeo": "200504",
    "departamento": "Piura",
    "provincia": "Paita",
    "distrito": "Colan"
  },
  {
    "ubigeo": "200505",
    "departamento": "Piura",
    "provincia": "Paita",
    "distrito": "La Huaca"
  },
  {
    "ubigeo": "200506",
    "departamento": "Piura",
    "provincia": "Paita",
    "distrito": "Tamarindo"
  },
  {
    "ubigeo": "200507",
    "departamento": "Piura",
    "provincia": "Paita",
    "distrito": "Vichayal"
  },
  {
    "ubigeo": "200601",
    "departamento": "Piura",
    "provincia": "Sullana",
    "distrito": "Sullana"
  },
  {
    "ubigeo": "200602",
    "departamento": "Piura",
    "provincia": "Sullana",
    "distrito": "Bellavista"
  },
  {
    "ubigeo": "200603",
    "departamento": "Piura",
    "provincia": "Sullana",
    "distrito": "Ignacio Escudero"
  },
  {
    "ubigeo": "200604",
    "departamento": "Piura",
    "provincia": "Sullana",
    "distrito": "Lancones"
  },
  {
    "ubigeo": "200605",
    "departamento": "Piura",
    "provincia": "Sullana",
    "distrito": "Marcavelica"
  },
  {
    "ubigeo": "200606",
    "departamento": "Piura",
    "provincia": "Sullana",
    "distrito": "Miguel Checa"
  },
  {
    "ubigeo": "200607",
    "departamento": "Piura",
    "provincia": "Sullana",
    "distrito": "Querecotillo"
  },
  {
    "ubigeo": "200608",
    "departamento": "Piura",
    "provincia": "Sullana",
    "distrito": "Salitral"
  },
  {
    "ubigeo": "200701",
    "departamento": "Piura",
    "provincia": "Talara",
    "distrito": "Pariñas"
  },
  {
    "ubigeo": "200702",
    "departamento": "Piura",
    "provincia": "Talara",
    "distrito": "El Alto"
  },
  {
    "ubigeo": "200703",
    "departamento": "Piura",
    "provincia": "Talara",
    "distrito": "La Brea"
  },
  {
    "ubigeo": "200704",
    "departamento": "Piura",
    "provincia": "Talara",
    "distrito": "Lobitos"
  },
  {
    "ubigeo": "200705",
    "departamento": "Piura",
    "provincia": "Talara",
    "distrito": "Los Organos"
  },
  {
    "ubigeo": "200706",
    "departamento": "Piura",
    "provincia": "Talara",
    "distrito": "Mancora"
  },
  {
    "ubigeo": "200801",
    "departamento": "Piura",
    "provincia": "Sechura",
    "distrito": "Sechura"
  },
  {
    "ubigeo": "200802",
    "departamento": "Piura",
    "provincia": "Sechura",
    "distrito": "Bellavista de La Union"
  },
  {
    "ubigeo": "200803",
    "departamento": "Piura",
    "provincia": "Sechura",
    "distrito": "Bernal"
  },
  {
    "ubigeo": "200804",
    "departamento": "Piura",
    "provincia": "Sechura",
    "distrito": "Cristo Nos Valga"
  },
  {
    "ubigeo": "200805",
    "departamento": "Piura",
    "provincia": "Sechura",
    "distrito": "Vice"
  },
  {
    "ubigeo": "200806",
    "departamento": "Piura",
    "provincia": "Sechura",
    "distrito": "Rinconada Llicuar"
  },
  {
    "ubigeo": "210101",
    "departamento": "Puno",
    "provincia": "Puno",
    "distrito": "Puno"
  },
  {
    "ubigeo": "210102",
    "departamento": "Puno",
    "provincia": "Puno",
    "distrito": "Acora"
  },
  {
    "ubigeo": "210103",
    "departamento": "Puno",
    "provincia": "Puno",
    "distrito": "Amantani"
  },
  {
    "ubigeo": "210104",
    "departamento": "Puno",
    "provincia": "Puno",
    "distrito": "Atuncolla"
  },
  {
    "ubigeo": "210105",
    "departamento": "Puno",
    "provincia": "Puno",
    "distrito": "Capachica"
  },
  {
    "ubigeo": "210106",
    "departamento": "Puno",
    "provincia": "Puno",
    "distrito": "Chucuito"
  },
  {
    "ubigeo": "210107",
    "departamento": "Puno",
    "provincia": "Puno",
    "distrito": "Coata"
  },
  {
    "ubigeo": "210108",
    "departamento": "Puno",
    "provincia": "Puno",
    "distrito": "Huata"
  },
  {
    "ubigeo": "210109",
    "departamento": "Puno",
    "provincia": "Puno",
    "distrito": "Mañazo"
  },
  {
    "ubigeo": "210110",
    "departamento": "Puno",
    "provincia": "Puno",
    "distrito": "Paucarcolla"
  },
  {
    "ubigeo": "210111",
    "departamento": "Puno",
    "provincia": "Puno",
    "distrito": "Pichacani"
  },
  {
    "ubigeo": "210112",
    "departamento": "Puno",
    "provincia": "Puno",
    "distrito": "Plateria"
  },
  {
    "ubigeo": "210113",
    "departamento": "Puno",
    "provincia": "Puno",
    "distrito": "San Antonio"
  },
  {
    "ubigeo": "210114",
    "departamento": "Puno",
    "provincia": "Puno",
    "distrito": "Tiquillaca"
  },
  {
    "ubigeo": "210115",
    "departamento": "Puno",
    "provincia": "Puno",
    "distrito": "Vilque"
  },
  {
    "ubigeo": "210201",
    "departamento": "Puno",
    "provincia": "Azángaro",
    "distrito": "Azángaro"
  },
  {
    "ubigeo": "210202",
    "departamento": "Puno",
    "provincia": "Azángaro",
    "distrito": "Achaya"
  },
  {
    "ubigeo": "210203",
    "departamento": "Puno",
    "provincia": "Azángaro",
    "distrito": "Arapa"
  },
  {
    "ubigeo": "210204",
    "departamento": "Puno",
    "provincia": "Azángaro",
    "distrito": "Asillo"
  },
  {
    "ubigeo": "210205",
    "departamento": "Puno",
    "provincia": "Azángaro",
    "distrito": "Caminaca"
  },
  {
    "ubigeo": "210206",
    "departamento": "Puno",
    "provincia": "Azángaro",
    "distrito": "Chupa"
  },
  {
    "ubigeo": "210207",
    "departamento": "Puno",
    "provincia": "Azángaro",
    "distrito": "Jose Domingo Choquehuanca"
  },
  {
    "ubigeo": "210208",
    "departamento": "Puno",
    "provincia": "Azángaro",
    "distrito": "Muñani"
  },
  {
    "ubigeo": "210209",
    "departamento": "Puno",
    "provincia": "Azángaro",
    "distrito": "Potoni"
  },
  {
    "ubigeo": "210210",
    "departamento": "Puno",
    "provincia": "Azángaro",
    "distrito": "Saman"
  },
  {
    "ubigeo": "210211",
    "departamento": "Puno",
    "provincia": "Azángaro",
    "distrito": "San Anton"
  },
  {
    "ubigeo": "210212",
    "departamento": "Puno",
    "provincia": "Azángaro",
    "distrito": "San Jose"
  },
  {
    "ubigeo": "210213",
    "departamento": "Puno",
    "provincia": "Azángaro",
    "distrito": "San Juan de Salinas"
  },
  {
    "ubigeo": "210214",
    "departamento": "Puno",
    "provincia": "Azángaro",
    "distrito": "Santiago de Pupuja"
  },
  {
    "ubigeo": "210215",
    "departamento": "Puno",
    "provincia": "Azángaro",
    "distrito": "Tirapata"
  },
  {
    "ubigeo": "210301",
    "departamento": "Puno",
    "provincia": "Carabaya",
    "distrito": "Macusani"
  },
  {
    "ubigeo": "210302",
    "departamento": "Puno",
    "provincia": "Carabaya",
    "distrito": "Ajoyani"
  },
  {
    "ubigeo": "210303",
    "departamento": "Puno",
    "provincia": "Carabaya",
    "distrito": "Ayapata"
  },
  {
    "ubigeo": "210304",
    "departamento": "Puno",
    "provincia": "Carabaya",
    "distrito": "Coasa"
  },
  {
    "ubigeo": "210305",
    "departamento": "Puno",
    "provincia": "Carabaya",
    "distrito": "Corani"
  },
  {
    "ubigeo": "210306",
    "departamento": "Puno",
    "provincia": "Carabaya",
    "distrito": "Crucero"
  },
  {
    "ubigeo": "210307",
    "departamento": "Puno",
    "provincia": "Carabaya",
    "distrito": "Ituata"
  },
  {
    "ubigeo": "210308",
    "departamento": "Puno",
    "provincia": "Carabaya",
    "distrito": "Ollachea"
  },
  {
    "ubigeo": "210309",
    "departamento": "Puno",
    "provincia": "Carabaya",
    "distrito": "San Gaban"
  },
  {
    "ubigeo": "210310",
    "departamento": "Puno",
    "provincia": "Carabaya",
    "distrito": "Usicayos"
  },
  {
    "ubigeo": "210401",
    "departamento": "Puno",
    "provincia": "Chucuito",
    "distrito": "Juli"
  },
  {
    "ubigeo": "210402",
    "departamento": "Puno",
    "provincia": "Chucuito",
    "distrito": "Desaguadero"
  },
  {
    "ubigeo": "210403",
    "departamento": "Puno",
    "provincia": "Chucuito",
    "distrito": "Huacullani"
  },
  {
    "ubigeo": "210404",
    "departamento": "Puno",
    "provincia": "Chucuito",
    "distrito": "Kelluyo"
  },
  {
    "ubigeo": "210405",
    "departamento": "Puno",
    "provincia": "Chucuito",
    "distrito": "Pisacoma"
  },
  {
    "ubigeo": "210406",
    "departamento": "Puno",
    "provincia": "Chucuito",
    "distrito": "Pomata"
  },
  {
    "ubigeo": "210407",
    "departamento": "Puno",
    "provincia": "Chucuito",
    "distrito": "Zepita"
  },
  {
    "ubigeo": "210501",
    "departamento": "Puno",
    "provincia": "El Collao",
    "distrito": "Ilave"
  },
  {
    "ubigeo": "210502",
    "departamento": "Puno",
    "provincia": "El Collao",
    "distrito": "Capazo"
  },
  {
    "ubigeo": "210503",
    "departamento": "Puno",
    "provincia": "El Collao",
    "distrito": "Pilcuyo"
  },
  {
    "ubigeo": "210504",
    "departamento": "Puno",
    "provincia": "El Collao",
    "distrito": "Santa Rosa"
  },
  {
    "ubigeo": "210505",
    "departamento": "Puno",
    "provincia": "El Collao",
    "distrito": "Conduriri"
  },
  {
    "ubigeo": "210601",
    "departamento": "Puno",
    "provincia": "Huancane",
    "distrito": "Huancane"
  },
  {
    "ubigeo": "210602",
    "departamento": "Puno",
    "provincia": "Huancane",
    "distrito": "Cojata"
  },
  {
    "ubigeo": "210603",
    "departamento": "Puno",
    "provincia": "Huancane",
    "distrito": "Huatasani"
  },
  {
    "ubigeo": "210604",
    "departamento": "Puno",
    "provincia": "Huancane",
    "distrito": "Inchupalla"
  },
  {
    "ubigeo": "210605",
    "departamento": "Puno",
    "provincia": "Huancane",
    "distrito": "Pusi"
  },
  {
    "ubigeo": "210606",
    "departamento": "Puno",
    "provincia": "Huancane",
    "distrito": "Rosaspata"
  },
  {
    "ubigeo": "210607",
    "departamento": "Puno",
    "provincia": "Huancane",
    "distrito": "Taraco"
  },
  {
    "ubigeo": "210608",
    "departamento": "Puno",
    "provincia": "Huancane",
    "distrito": "Vilque Chico"
  },
  {
    "ubigeo": "210701",
    "departamento": "Puno",
    "provincia": "Lampa",
    "distrito": "Lampa"
  },
  {
    "ubigeo": "210702",
    "departamento": "Puno",
    "provincia": "Lampa",
    "distrito": "Cabanilla"
  },
  {
    "ubigeo": "210703",
    "departamento": "Puno",
    "provincia": "Lampa",
    "distrito": "Calapuja"
  },
  {
    "ubigeo": "210704",
    "departamento": "Puno",
    "provincia": "Lampa",
    "distrito": "Nicasio"
  },
  {
    "ubigeo": "210705",
    "departamento": "Puno",
    "provincia": "Lampa",
    "distrito": "Ocuviri"
  },
  {
    "ubigeo": "210706",
    "departamento": "Puno",
    "provincia": "Lampa",
    "distrito": "Palca"
  },
  {
    "ubigeo": "210707",
    "departamento": "Puno",
    "provincia": "Lampa",
    "distrito": "Paratia"
  },
  {
    "ubigeo": "210708",
    "departamento": "Puno",
    "provincia": "Lampa",
    "distrito": "Pucara"
  },
  {
    "ubigeo": "210709",
    "departamento": "Puno",
    "provincia": "Lampa",
    "distrito": "Santa Lucia"
  },
  {
    "ubigeo": "210710",
    "departamento": "Puno",
    "provincia": "Lampa",
    "distrito": "Vilavila"
  },
  {
    "ubigeo": "210801",
    "departamento": "Puno",
    "provincia": "Melgar",
    "distrito": "Ayaviri"
  },
  {
    "ubigeo": "210802",
    "departamento": "Puno",
    "provincia": "Melgar",
    "distrito": "Antauta"
  },
  {
    "ubigeo": "210803",
    "departamento": "Puno",
    "provincia": "Melgar",
    "distrito": "Cupi"
  },
  {
    "ubigeo": "210804",
    "departamento": "Puno",
    "provincia": "Melgar",
    "distrito": "Llalli"
  },
  {
    "ubigeo": "210805",
    "departamento": "Puno",
    "provincia": "Melgar",
    "distrito": "Macari"
  },
  {
    "ubigeo": "210806",
    "departamento": "Puno",
    "provincia": "Melgar",
    "distrito": "Nuñoa"
  },
  {
    "ubigeo": "210807",
    "departamento": "Puno",
    "provincia": "Melgar",
    "distrito": "Orurillo"
  },
  {
    "ubigeo": "210808",
    "departamento": "Puno",
    "provincia": "Melgar",
    "distrito": "Santa Rosa"
  },
  {
    "ubigeo": "210809",
    "departamento": "Puno",
    "provincia": "Melgar",
    "distrito": "Umachiri"
  },
  {
    "ubigeo": "210901",
    "departamento": "Puno",
    "provincia": "Moho",
    "distrito": "Moho"
  },
  {
    "ubigeo": "210902",
    "departamento": "Puno",
    "provincia": "Moho",
    "distrito": "Conima"
  },
  {
    "ubigeo": "210903",
    "departamento": "Puno",
    "provincia": "Moho",
    "distrito": "Huayrapata"
  },
  {
    "ubigeo": "210904",
    "departamento": "Puno",
    "provincia": "Moho",
    "distrito": "Tilali"
  },
  {
    "ubigeo": "211001",
    "departamento": "Puno",
    "provincia": "San Antonio de Putina",
    "distrito": "Putina"
  },
  {
    "ubigeo": "211002",
    "departamento": "Puno",
    "provincia": "San Antonio de Putina",
    "distrito": "Ananea"
  },
  {
    "ubigeo": "211003",
    "departamento": "Puno",
    "provincia": "San Antonio de Putina",
    "distrito": "Pedro Vilca Apaza"
  },
  {
    "ubigeo": "211004",
    "departamento": "Puno",
    "provincia": "San Antonio de Putina",
    "distrito": "Quilcapuncu"
  },
  {
    "ubigeo": "211005",
    "departamento": "Puno",
    "provincia": "San Antonio de Putina",
    "distrito": "Sina"
  },
  {
    "ubigeo": "211101",
    "departamento": "Puno",
    "provincia": "San Román",
    "distrito": "Juliaca"
  },
  {
    "ubigeo": "211102",
    "departamento": "Puno",
    "provincia": "San Román",
    "distrito": "Cabana"
  },
  {
    "ubigeo": "211103",
    "departamento": "Puno",
    "provincia": "San Román",
    "distrito": "Cabanillas"
  },
  {
    "ubigeo": "211104",
    "departamento": "Puno",
    "provincia": "San Román",
    "distrito": "Caracoto"
  },
  {
    "ubigeo": "211105",
    "departamento": "Puno",
    "provincia": "San Román",
    "distrito": "San Miguel"
  },
  {
    "ubigeo": "211201",
    "departamento": "Puno",
    "provincia": "Sandia",
    "distrito": "Sandia"
  },
  {
    "ubigeo": "211202",
    "departamento": "Puno",
    "provincia": "Sandia",
    "distrito": "Cuyocuyo"
  },
  {
    "ubigeo": "211203",
    "departamento": "Puno",
    "provincia": "Sandia",
    "distrito": "Limbani"
  },
  {
    "ubigeo": "211204",
    "departamento": "Puno",
    "provincia": "Sandia",
    "distrito": "Patambuco"
  },
  {
    "ubigeo": "211205",
    "departamento": "Puno",
    "provincia": "Sandia",
    "distrito": "Phara"
  },
  {
    "ubigeo": "211206",
    "departamento": "Puno",
    "provincia": "Sandia",
    "distrito": "Quiaca"
  },
  {
    "ubigeo": "211207",
    "departamento": "Puno",
    "provincia": "Sandia",
    "distrito": "San Juan del Oro"
  },
  {
    "ubigeo": "211208",
    "departamento": "Puno",
    "provincia": "Sandia",
    "distrito": "Yanahuaya"
  },
  {
    "ubigeo": "211209",
    "departamento": "Puno",
    "provincia": "Sandia",
    "distrito": "Alto Inambari"
  },
  {
    "ubigeo": "211210",
    "departamento": "Puno",
    "provincia": "Sandia",
    "distrito": "San Pedro de Putina Punco"
  },
  {
    "ubigeo": "211301",
    "departamento": "Puno",
    "provincia": "Yunguyo",
    "distrito": "Yunguyo"
  },
  {
    "ubigeo": "211302",
    "departamento": "Puno",
    "provincia": "Yunguyo",
    "distrito": "Anapia"
  },
  {
    "ubigeo": "211303",
    "departamento": "Puno",
    "provincia": "Yunguyo",
    "distrito": "Copani"
  },
  {
    "ubigeo": "211304",
    "departamento": "Puno",
    "provincia": "Yunguyo",
    "distrito": "Cuturapi"
  },
  {
    "ubigeo": "211305",
    "departamento": "Puno",
    "provincia": "Yunguyo",
    "distrito": "Ollaraya"
  },
  {
    "ubigeo": "211306",
    "departamento": "Puno",
    "provincia": "Yunguyo",
    "distrito": "Tinicachi"
  },
  {
    "ubigeo": "211307",
    "departamento": "Puno",
    "provincia": "Yunguyo",
    "distrito": "Unicachi"
  },
  {
    "ubigeo": "220101",
    "departamento": "San Martín",
    "provincia": "Moyobamba",
    "distrito": "Moyobamba"
  },
  {
    "ubigeo": "220102",
    "departamento": "San Martín",
    "provincia": "Moyobamba",
    "distrito": "Calzada"
  },
  {
    "ubigeo": "220103",
    "departamento": "San Martín",
    "provincia": "Moyobamba",
    "distrito": "Habana"
  },
  {
    "ubigeo": "220104",
    "departamento": "San Martín",
    "provincia": "Moyobamba",
    "distrito": "Jepelacio"
  },
  {
    "ubigeo": "220105",
    "departamento": "San Martín",
    "provincia": "Moyobamba",
    "distrito": "Soritor"
  },
  {
    "ubigeo": "220106",
    "departamento": "San Martín",
    "provincia": "Moyobamba",
    "distrito": "Yantalo"
  },
  {
    "ubigeo": "220201",
    "departamento": "San Martín",
    "provincia": "San Martín",
    "distrito": "Bellavista"
  },
  {
    "ubigeo": "220202",
    "departamento": "San Martín",
    "provincia": "San Martín",
    "distrito": "Alto Biavo"
  },
  {
    "ubigeo": "220203",
    "departamento": "San Martín",
    "provincia": "San Martín",
    "distrito": "Bajo Biavo"
  },
  {
    "ubigeo": "220204",
    "departamento": "San Martín",
    "provincia": "San Martín",
    "distrito": "Huallaga"
  },
  {
    "ubigeo": "220205",
    "departamento": "San Martín",
    "provincia": "San Martín",
    "distrito": "San Pablo"
  },
  {
    "ubigeo": "220206",
    "departamento": "San Martín",
    "provincia": "San Martín",
    "distrito": "San Rafael"
  },
  {
    "ubigeo": "220301",
    "departamento": "San Martín",
    "provincia": "El Dorado",
    "distrito": "San Jose de Sisa"
  },
  {
    "ubigeo": "220302",
    "departamento": "San Martín",
    "provincia": "El Dorado",
    "distrito": "Agua Blanca"
  },
  {
    "ubigeo": "220303",
    "departamento": "San Martín",
    "provincia": "El Dorado",
    "distrito": "San Martín"
  },
  {
    "ubigeo": "220304",
    "departamento": "San Martín",
    "provincia": "El Dorado",
    "distrito": "Santa Rosa"
  },
  {
    "ubigeo": "220305",
    "departamento": "San Martín",
    "provincia": "El Dorado",
    "distrito": "Shatoja"
  },
  {
    "ubigeo": "220401",
    "departamento": "San Martín",
    "provincia": "Huallaga",
    "distrito": "Saposoa"
  },
  {
    "ubigeo": "220402",
    "departamento": "San Martín",
    "provincia": "Huallaga",
    "distrito": "Alto Saposoa"
  },
  {
    "ubigeo": "220403",
    "departamento": "San Martín",
    "provincia": "Huallaga",
    "distrito": "El Eslabón"
  },
  {
    "ubigeo": "220404",
    "departamento": "San Martín",
    "provincia": "Huallaga",
    "distrito": "Piscoyacu"
  },
  {
    "ubigeo": "220405",
    "departamento": "San Martín",
    "provincia": "Huallaga",
    "distrito": "Sacanche"
  },
  {
    "ubigeo": "220406",
    "departamento": "San Martín",
    "provincia": "Huallaga",
    "distrito": "Tingo de Saposoa"
  },
  {
    "ubigeo": "220501",
    "departamento": "San Martín",
    "provincia": "Lamas",
    "distrito": "Lamas"
  },
  {
    "ubigeo": "220502",
    "departamento": "San Martín",
    "provincia": "Lamas",
    "distrito": "Alonso de Alvarado"
  },
  {
    "ubigeo": "220503",
    "departamento": "San Martín",
    "provincia": "Lamas",
    "distrito": "Barranquita"
  },
  {
    "ubigeo": "220504",
    "departamento": "San Martín",
    "provincia": "Lamas",
    "distrito": "Caynarachi"
  },
  {
    "ubigeo": "220505",
    "departamento": "San Martín",
    "provincia": "Lamas",
    "distrito": "Cuñumbuqui"
  },
  {
    "ubigeo": "220506",
    "departamento": "San Martín",
    "provincia": "Lamas",
    "distrito": "Pinto Recodo"
  },
  {
    "ubigeo": "220507",
    "departamento": "San Martín",
    "provincia": "Lamas",
    "distrito": "Rumisapa"
  },
  {
    "ubigeo": "220508",
    "departamento": "San Martín",
    "provincia": "Lamas",
    "distrito": "San Roque de Cumbaza"
  },
  {
    "ubigeo": "220509",
    "departamento": "San Martín",
    "provincia": "Lamas",
    "distrito": "Shanao"
  },
  {
    "ubigeo": "220510",
    "departamento": "San Martín",
    "provincia": "Lamas",
    "distrito": "Tabalosos"
  },
  {
    "ubigeo": "220511",
    "departamento": "San Martín",
    "provincia": "Lamas",
    "distrito": "Zapatero"
  },
  {
    "ubigeo": "220601",
    "departamento": "San Martín",
    "provincia": "Mariscal Cáceres",
    "distrito": "Juanjuí"
  },
  {
    "ubigeo": "220602",
    "departamento": "San Martín",
    "provincia": "Mariscal Cáceres",
    "distrito": "Campanilla"
  },
  {
    "ubigeo": "220603",
    "departamento": "San Martín",
    "provincia": "Mariscal Cáceres",
    "distrito": "Huicungo"
  },
  {
    "ubigeo": "220604",
    "departamento": "San Martín",
    "provincia": "Mariscal Cáceres",
    "distrito": "Pachiza"
  },
  {
    "ubigeo": "220605",
    "departamento": "San Martín",
    "provincia": "Mariscal Cáceres",
    "distrito": "Pajarillo"
  },
  {
    "ubigeo": "220701",
    "departamento": "San Martín",
    "provincia": "Picota",
    "distrito": "Picota"
  },
  {
    "ubigeo": "220702",
    "departamento": "San Martín",
    "provincia": "Picota",
    "distrito": "Buenos Aires"
  },
  {
    "ubigeo": "220703",
    "departamento": "San Martín",
    "provincia": "Picota",
    "distrito": "Caspisapa"
  },
  {
    "ubigeo": "220704",
    "departamento": "San Martín",
    "provincia": "Picota",
    "distrito": "Pilluana"
  },
  {
    "ubigeo": "220705",
    "departamento": "San Martín",
    "provincia": "Picota",
    "distrito": "Pucacaca"
  },
  {
    "ubigeo": "220706",
    "departamento": "San Martín",
    "provincia": "Picota",
    "distrito": "San Cristóbal"
  },
  {
    "ubigeo": "220707",
    "departamento": "San Martín",
    "provincia": "Picota",
    "distrito": "San Hilarión"
  },
  {
    "ubigeo": "220708",
    "departamento": "San Martín",
    "provincia": "Picota",
    "distrito": "Shamboyacu"
  },
  {
    "ubigeo": "220709",
    "departamento": "San Martín",
    "provincia": "Picota",
    "distrito": "Tingo de Ponasa"
  },
  {
    "ubigeo": "220710",
    "departamento": "San Martín",
    "provincia": "Picota",
    "distrito": "Tres Unidos"
  },
  {
    "ubigeo": "220801",
    "departamento": "San Martín",
    "provincia": "Rioja",
    "distrito": "Rioja"
  },
  {
    "ubigeo": "220802",
    "departamento": "San Martín",
    "provincia": "Rioja",
    "distrito": "Awajun"
  },
  {
    "ubigeo": "220803",
    "departamento": "San Martín",
    "provincia": "Rioja",
    "distrito": "Elías Soplin Vargas"
  },
  {
    "ubigeo": "220804",
    "departamento": "San Martín",
    "provincia": "Rioja",
    "distrito": "Nueva Cajamarca"
  },
  {
    "ubigeo": "220805",
    "departamento": "San Martín",
    "provincia": "Rioja",
    "distrito": "Pardo Miguel"
  },
  {
    "ubigeo": "220806",
    "departamento": "San Martín",
    "provincia": "Rioja",
    "distrito": "Posic"
  },
  {
    "ubigeo": "220807",
    "departamento": "San Martín",
    "provincia": "Rioja",
    "distrito": "San Fernando"
  },
  {
    "ubigeo": "220808",
    "departamento": "San Martín",
    "provincia": "Rioja",
    "distrito": "Yorongos"
  },
  {
    "ubigeo": "220809",
    "departamento": "San Martín",
    "provincia": "Rioja",
    "distrito": "Yuracyacu"
  },
  {
    "ubigeo": "220901",
    "departamento": "San Martín",
    "provincia": "San Martín",
    "distrito": "Tarapoto"
  },
  {
    "ubigeo": "220902",
    "departamento": "San Martín",
    "provincia": "San Martín",
    "distrito": "Alberto Leveau"
  },
  {
    "ubigeo": "220903",
    "departamento": "San Martín",
    "provincia": "San Martín",
    "distrito": "Cacatachi"
  },
  {
    "ubigeo": "220904",
    "departamento": "San Martín",
    "provincia": "San Martín",
    "distrito": "Chazuta"
  },
  {
    "ubigeo": "220905",
    "departamento": "San Martín",
    "provincia": "San Martín",
    "distrito": "Chipurana"
  },
  {
    "ubigeo": "220906",
    "departamento": "San Martín",
    "provincia": "San Martín",
    "distrito": "El Porvenir"
  },
  {
    "ubigeo": "220907",
    "departamento": "San Martín",
    "provincia": "San Martín",
    "distrito": "Huimbayoc"
  },
  {
    "ubigeo": "220908",
    "departamento": "San Martín",
    "provincia": "San Martín",
    "distrito": "Juan Guerra"
  },
  {
    "ubigeo": "220909",
    "departamento": "San Martín",
    "provincia": "San Martín",
    "distrito": "La Banda de Shilcayo"
  },
  {
    "ubigeo": "220910",
    "departamento": "San Martín",
    "provincia": "San Martín",
    "distrito": "Morales"
  },
  {
    "ubigeo": "220911",
    "departamento": "San Martín",
    "provincia": "San Martín",
    "distrito": "Papaplaya"
  },
  {
    "ubigeo": "220912",
    "departamento": "San Martín",
    "provincia": "San Martín",
    "distrito": "San Antonio"
  },
  {
    "ubigeo": "220913",
    "departamento": "San Martín",
    "provincia": "San Martín",
    "distrito": "Sauce"
  },
  {
    "ubigeo": "220914",
    "departamento": "San Martín",
    "provincia": "San Martín",
    "distrito": "Shapaja"
  },
  {
    "ubigeo": "221001",
    "departamento": "San Martín",
    "provincia": "Tocache",
    "distrito": "Tocache"
  },
  {
    "ubigeo": "221002",
    "departamento": "San Martín",
    "provincia": "Tocache",
    "distrito": "Nuevo Progreso"
  },
  {
    "ubigeo": "221003",
    "departamento": "San Martín",
    "provincia": "Tocache",
    "distrito": "Polvora"
  },
  {
    "ubigeo": "221004",
    "departamento": "San Martín",
    "provincia": "Tocache",
    "distrito": "Shunte"
  },
  {
    "ubigeo": "221005",
    "departamento": "San Martín",
    "provincia": "Tocache",
    "distrito": "Uchiza"
  },
  {
    "ubigeo": "230101",
    "departamento": "Tacna",
    "provincia": "Tacna",
    "distrito": "Tacna"
  },
  {
    "ubigeo": "230102",
    "departamento": "Tacna",
    "provincia": "Tacna",
    "distrito": "Alto de La Alianza"
  },
  {
    "ubigeo": "230103",
    "departamento": "Tacna",
    "provincia": "Tacna",
    "distrito": "Calana"
  },
  {
    "ubigeo": "230104",
    "departamento": "Tacna",
    "provincia": "Tacna",
    "distrito": "Ciudad Nueva"
  },
  {
    "ubigeo": "230105",
    "departamento": "Tacna",
    "provincia": "Tacna",
    "distrito": "Inclan"
  },
  {
    "ubigeo": "230106",
    "departamento": "Tacna",
    "provincia": "Tacna",
    "distrito": "Pachia"
  },
  {
    "ubigeo": "230107",
    "departamento": "Tacna",
    "provincia": "Tacna",
    "distrito": "Palca"
  },
  {
    "ubigeo": "230108",
    "departamento": "Tacna",
    "provincia": "Tacna",
    "distrito": "Pocollay"
  },
  {
    "ubigeo": "230109",
    "departamento": "Tacna",
    "provincia": "Tacna",
    "distrito": "Sama"
  },
  {
    "ubigeo": "230110",
    "departamento": "Tacna",
    "provincia": "Tacna",
    "distrito": "Coronel Gregorio Albarracín Lanchipa"
  },
  {
    "ubigeo": "230111",
    "departamento": "Tacna",
    "provincia": "Tacna",
    "distrito": "La Yarada-Los Palos"
  },
  {
    "ubigeo": "230201",
    "departamento": "Tacna",
    "provincia": "Candarave",
    "distrito": "Candarave"
  },
  {
    "ubigeo": "230202",
    "departamento": "Tacna",
    "provincia": "Candarave",
    "distrito": "Cairani"
  },
  {
    "ubigeo": "230203",
    "departamento": "Tacna",
    "provincia": "Candarave",
    "distrito": "Camilaca"
  },
  {
    "ubigeo": "230204",
    "departamento": "Tacna",
    "provincia": "Candarave",
    "distrito": "Curibaya"
  },
  {
    "ubigeo": "230205",
    "departamento": "Tacna",
    "provincia": "Candarave",
    "distrito": "Huanuara"
  },
  {
    "ubigeo": "230206",
    "departamento": "Tacna",
    "provincia": "Candarave",
    "distrito": "Quilahuani"
  },
  {
    "ubigeo": "230301",
    "departamento": "Tacna",
    "provincia": "Jorge Basadre",
    "distrito": "Locumba"
  },
  {
    "ubigeo": "230302",
    "departamento": "Tacna",
    "provincia": "Jorge Basadre",
    "distrito": "Ilabaya"
  },
  {
    "ubigeo": "230303",
    "departamento": "Tacna",
    "provincia": "Jorge Basadre",
    "distrito": "Ite"
  },
  {
    "ubigeo": "230401",
    "departamento": "Tacna",
    "provincia": "Tarata",
    "distrito": "Tarata"
  },
  {
    "ubigeo": "230402",
    "departamento": "Tacna",
    "provincia": "Tarata",
    "distrito": "Héroes Albarracín"
  },
  {
    "ubigeo": "230403",
    "departamento": "Tacna",
    "provincia": "Tarata",
    "distrito": "Estique"
  },
  {
    "ubigeo": "230404",
    "departamento": "Tacna",
    "provincia": "Tarata",
    "distrito": "Estique-Pampa"
  },
  {
    "ubigeo": "230405",
    "departamento": "Tacna",
    "provincia": "Tarata",
    "distrito": "Sitajara"
  },
  {
    "ubigeo": "230406",
    "departamento": "Tacna",
    "provincia": "Tarata",
    "distrito": "Susapaya"
  },
  {
    "ubigeo": "230407",
    "departamento": "Tacna",
    "provincia": "Tarata",
    "distrito": "Tarucachi"
  },
  {
    "ubigeo": "230408",
    "departamento": "Tacna",
    "provincia": "Tarata",
    "distrito": "Ticaco"
  },
  {
    "ubigeo": "240101",
    "departamento": "Tumbes",
    "provincia": "Tumbes",
    "distrito": "Tumbes"
  },
  {
    "ubigeo": "240102",
    "departamento": "Tumbes",
    "provincia": "Tumbes",
    "distrito": "Corrales"
  },
  {
    "ubigeo": "240103",
    "departamento": "Tumbes",
    "provincia": "Tumbes",
    "distrito": "La Cruz"
  },
  {
    "ubigeo": "240104",
    "departamento": "Tumbes",
    "provincia": "Tumbes",
    "distrito": "Pampas de Hospital"
  },
  {
    "ubigeo": "240105",
    "departamento": "Tumbes",
    "provincia": "Tumbes",
    "distrito": "San Jacinto"
  },
  {
    "ubigeo": "240106",
    "departamento": "Tumbes",
    "provincia": "Tumbes",
    "distrito": "San Juan de La Virgen"
  },
  {
    "ubigeo": "240201",
    "departamento": "Tumbes",
    "provincia": "Contralmirante Villa",
    "distrito": "Zorritos"
  },
  {
    "ubigeo": "240202",
    "departamento": "Tumbes",
    "provincia": "Contralmirante Villa",
    "distrito": "Casitas"
  },
  {
    "ubigeo": "240203",
    "departamento": "Tumbes",
    "provincia": "Contralmirante Villa",
    "distrito": "Canoas de Punta Sal"
  },
  {
    "ubigeo": "240301",
    "departamento": "Tumbes",
    "provincia": "Zarumilla",
    "distrito": "Zarumilla"
  },
  {
    "ubigeo": "240302",
    "departamento": "Tumbes",
    "provincia": "Zarumilla",
    "distrito": "Aguas Verdes"
  },
  {
    "ubigeo": "240303",
    "departamento": "Tumbes",
    "provincia": "Zarumilla",
    "distrito": "Matapalo"
  },
  {
    "ubigeo": "240304",
    "departamento": "Tumbes",
    "provincia": "Zarumilla",
    "distrito": "Papayal"
  },
  {
    "ubigeo": "250101",
    "departamento": "Ucayali",
    "provincia": "Coronel Portillo",
    "distrito": "Calleria"
  },
  {
    "ubigeo": "250102",
    "departamento": "Ucayali",
    "provincia": "Coronel Portillo",
    "distrito": "Campoverde"
  },
  {
    "ubigeo": "250103",
    "departamento": "Ucayali",
    "provincia": "Coronel Portillo",
    "distrito": "Iparia"
  },
  {
    "ubigeo": "250104",
    "departamento": "Ucayali",
    "provincia": "Coronel Portillo",
    "distrito": "Masisea"
  },
  {
    "ubigeo": "250105",
    "departamento": "Ucayali",
    "provincia": "Coronel Portillo",
    "distrito": "Yarinacocha"
  },
  {
    "ubigeo": "250106",
    "departamento": "Ucayali",
    "provincia": "Coronel Portillo",
    "distrito": "Nueva Requena"
  },
  {
    "ubigeo": "250107",
    "departamento": "Ucayali",
    "provincia": "Coronel Portillo",
    "distrito": "Manantay"
  },
  {
    "ubigeo": "250201",
    "departamento": "Ucayali",
    "provincia": "Atalaya",
    "distrito": "Raymondi"
  },
  {
    "ubigeo": "250202",
    "departamento": "Ucayali",
    "provincia": "Atalaya",
    "distrito": "Sepahua"
  },
  {
    "ubigeo": "250203",
    "departamento": "Ucayali",
    "provincia": "Atalaya",
    "distrito": "Tahuania"
  },
  {
    "ubigeo": "250204",
    "departamento": "Ucayali",
    "provincia": "Atalaya",
    "distrito": "Yurua"
  },
  {
    "ubigeo": "250301",
    "departamento": "Ucayali",
    "provincia": "Padre Abad",
    "distrito": "Padre Abad"
  },
  {
    "ubigeo": "250302",
    "departamento": "Ucayali",
    "provincia": "Padre Abad",
    "distrito": "Irazola"
  },
  {
    "ubigeo": "250303",
    "departamento": "Ucayali",
    "provincia": "Padre Abad",
    "distrito": "Curimana"
  },
  {
    "ubigeo": "250304",
    "departamento": "Ucayali",
    "provincia": "Padre Abad",
    "distrito": "Neshuya"
  },
  {
    "ubigeo": "250305",
    "departamento": "Ucayali",
    "provincia": "Padre Abad",
    "distrito": "Alexander Von Humboldt"
  },
  {
    "ubigeo": "250401",
    "departamento": "Ucayali",
    "provincia": "Purús",
    "distrito": "Purús"
  }
];

export const UBIGEO_NESTED: UbigeoDepartamento[] = [
  {
    "codigo": "10",
    "nombre": "Huanuco",
    "provincias": [
      {
        "codigo": "1001",
        "nombre": "Huanuco",
        "distritos": [
          {
            "ubigeo": "100101",
            "nombre": "Huanuco"
          },
          {
            "ubigeo": "100102",
            "nombre": "Amarilis"
          },
          {
            "ubigeo": "100103",
            "nombre": "Chinchao"
          },
          {
            "ubigeo": "100104",
            "nombre": "Churubamba"
          },
          {
            "ubigeo": "100105",
            "nombre": "Margos"
          },
          {
            "ubigeo": "100106",
            "nombre": "Quisqui"
          },
          {
            "ubigeo": "100107",
            "nombre": "San Francisco de Cayran"
          },
          {
            "ubigeo": "100108",
            "nombre": "San Pedro de Chaulan"
          },
          {
            "ubigeo": "100109",
            "nombre": "Santa Maria del Valle"
          },
          {
            "ubigeo": "100110",
            "nombre": "Yarumayo"
          },
          {
            "ubigeo": "100111",
            "nombre": "Pillco Marca"
          },
          {
            "ubigeo": "100112",
            "nombre": "Yacus"
          },
          {
            "ubigeo": "100113",
            "nombre": "San Pablo de Pillao"
          }
        ]
      },
      {
        "codigo": "1002",
        "nombre": "Ambo",
        "distritos": [
          {
            "ubigeo": "100201",
            "nombre": "Ambo"
          },
          {
            "ubigeo": "100202",
            "nombre": "Cayna"
          },
          {
            "ubigeo": "100203",
            "nombre": "Colpas"
          },
          {
            "ubigeo": "100204",
            "nombre": "Conchamarca"
          },
          {
            "ubigeo": "100205",
            "nombre": "Huacar"
          },
          {
            "ubigeo": "100206",
            "nombre": "San Francisco"
          },
          {
            "ubigeo": "100207",
            "nombre": "San Rafael"
          },
          {
            "ubigeo": "100208",
            "nombre": "Tomay Kichwa"
          }
        ]
      },
      {
        "codigo": "1003",
        "nombre": "Dos de Mayo",
        "distritos": [
          {
            "ubigeo": "100301",
            "nombre": "La Union"
          },
          {
            "ubigeo": "100307",
            "nombre": "Chuquis"
          },
          {
            "ubigeo": "100311",
            "nombre": "Marías"
          },
          {
            "ubigeo": "100313",
            "nombre": "Pachas"
          },
          {
            "ubigeo": "100316",
            "nombre": "Quivilla"
          },
          {
            "ubigeo": "100317",
            "nombre": "Ripan"
          },
          {
            "ubigeo": "100321",
            "nombre": "Shunqui"
          },
          {
            "ubigeo": "100322",
            "nombre": "Sillapata"
          },
          {
            "ubigeo": "100323",
            "nombre": "Yanas"
          }
        ]
      },
      {
        "codigo": "1004",
        "nombre": "Huacaybamba",
        "distritos": [
          {
            "ubigeo": "100401",
            "nombre": "Huacaybamba"
          },
          {
            "ubigeo": "100402",
            "nombre": "Canchabamba"
          },
          {
            "ubigeo": "100403",
            "nombre": "Cochabamba"
          },
          {
            "ubigeo": "100404",
            "nombre": "Pinra"
          }
        ]
      },
      {
        "codigo": "1005",
        "nombre": "Huamalíes",
        "distritos": [
          {
            "ubigeo": "100501",
            "nombre": "Llata"
          },
          {
            "ubigeo": "100502",
            "nombre": "Arancay"
          },
          {
            "ubigeo": "100503",
            "nombre": "Chavin de Pariarca"
          },
          {
            "ubigeo": "100504",
            "nombre": "Jacas Grande"
          },
          {
            "ubigeo": "100505",
            "nombre": "Jircan"
          },
          {
            "ubigeo": "100506",
            "nombre": "Miraflores"
          },
          {
            "ubigeo": "100507",
            "nombre": "Monzón"
          },
          {
            "ubigeo": "100508",
            "nombre": "Punchao"
          },
          {
            "ubigeo": "100509",
            "nombre": "Puños"
          },
          {
            "ubigeo": "100510",
            "nombre": "Singa"
          },
          {
            "ubigeo": "100511",
            "nombre": "Tantamayo"
          }
        ]
      },
      {
        "codigo": "1006",
        "nombre": "Leoncio Prado",
        "distritos": [
          {
            "ubigeo": "100601",
            "nombre": "Rupa-Rupa"
          },
          {
            "ubigeo": "100602",
            "nombre": "Daniel Alomias Robles"
          },
          {
            "ubigeo": "100603",
            "nombre": "Hermílio Valdizan"
          },
          {
            "ubigeo": "100604",
            "nombre": "Jose Crespo y Castillo"
          },
          {
            "ubigeo": "100605",
            "nombre": "Luyando"
          },
          {
            "ubigeo": "100606",
            "nombre": "Mariano Damaso Beraun"
          },
          {
            "ubigeo": "100607",
            "nombre": "Pucayacu"
          },
          {
            "ubigeo": "100608",
            "nombre": "Castillo Grande"
          },
          {
            "ubigeo": "100609",
            "nombre": "Pueblo Nuevo"
          },
          {
            "ubigeo": "100610",
            "nombre": "Santo Domingo de Anda"
          }
        ]
      },
      {
        "codigo": "1007",
        "nombre": "Marañon",
        "distritos": [
          {
            "ubigeo": "100701",
            "nombre": "Huacrachuco"
          },
          {
            "ubigeo": "100702",
            "nombre": "Cholon"
          },
          {
            "ubigeo": "100703",
            "nombre": "San Buenaventura"
          },
          {
            "ubigeo": "100704",
            "nombre": "La Morada"
          },
          {
            "ubigeo": "100705",
            "nombre": "Santa Rosa de Alto Yanajanca"
          }
        ]
      },
      {
        "codigo": "1008",
        "nombre": "Pachitea",
        "distritos": [
          {
            "ubigeo": "100801",
            "nombre": "Panao"
          },
          {
            "ubigeo": "100802",
            "nombre": "Chaglla"
          },
          {
            "ubigeo": "100803",
            "nombre": "Molino"
          },
          {
            "ubigeo": "100804",
            "nombre": "Umari"
          }
        ]
      },
      {
        "codigo": "1009",
        "nombre": "Puerto Inca",
        "distritos": [
          {
            "ubigeo": "100901",
            "nombre": "Puerto Inca"
          },
          {
            "ubigeo": "100902",
            "nombre": "Codo del Pozuzo"
          },
          {
            "ubigeo": "100903",
            "nombre": "Honoria"
          },
          {
            "ubigeo": "100904",
            "nombre": "Tournavista"
          },
          {
            "ubigeo": "100905",
            "nombre": "Yuyapichis"
          }
        ]
      },
      {
        "codigo": "1010",
        "nombre": "Lauricocha",
        "distritos": [
          {
            "ubigeo": "101001",
            "nombre": "Jesus"
          },
          {
            "ubigeo": "101002",
            "nombre": "Baños"
          },
          {
            "ubigeo": "101003",
            "nombre": "Jivia"
          },
          {
            "ubigeo": "101004",
            "nombre": "Queropalca"
          },
          {
            "ubigeo": "101005",
            "nombre": "Rondos"
          },
          {
            "ubigeo": "101006",
            "nombre": "San Francisco de Asís"
          },
          {
            "ubigeo": "101007",
            "nombre": "San Miguel de Cauri"
          }
        ]
      },
      {
        "codigo": "1011",
        "nombre": "Yarowilca",
        "distritos": [
          {
            "ubigeo": "101101",
            "nombre": "Chavinillo"
          },
          {
            "ubigeo": "101102",
            "nombre": "Cahuac"
          },
          {
            "ubigeo": "101103",
            "nombre": "Chacabamba"
          },
          {
            "ubigeo": "101104",
            "nombre": "Aparicio Pomares"
          },
          {
            "ubigeo": "101105",
            "nombre": "Jacas Chico"
          },
          {
            "ubigeo": "101106",
            "nombre": "Obas"
          },
          {
            "ubigeo": "101107",
            "nombre": "Pampamarca"
          },
          {
            "ubigeo": "101108",
            "nombre": "Choras"
          }
        ]
      }
    ]
  },
  {
    "codigo": "11",
    "nombre": "Ica",
    "provincias": [
      {
        "codigo": "1101",
        "nombre": "Ica",
        "distritos": [
          {
            "ubigeo": "110101",
            "nombre": "Ica"
          },
          {
            "ubigeo": "110102",
            "nombre": "La Tinguiña"
          },
          {
            "ubigeo": "110103",
            "nombre": "Los Aquijes"
          },
          {
            "ubigeo": "110104",
            "nombre": "Ocucaje"
          },
          {
            "ubigeo": "110105",
            "nombre": "Pachacutec"
          },
          {
            "ubigeo": "110106",
            "nombre": "Parcona"
          },
          {
            "ubigeo": "110107",
            "nombre": "Pueblo Nuevo"
          },
          {
            "ubigeo": "110108",
            "nombre": "Salas"
          },
          {
            "ubigeo": "110109",
            "nombre": "San Jose de los Molinos"
          },
          {
            "ubigeo": "110110",
            "nombre": "San Juan Bautista"
          },
          {
            "ubigeo": "110111",
            "nombre": "Santiago"
          },
          {
            "ubigeo": "110112",
            "nombre": "Subtanjalla"
          },
          {
            "ubigeo": "110113",
            "nombre": "Tate"
          },
          {
            "ubigeo": "110114",
            "nombre": "Yauca del Rosario"
          }
        ]
      },
      {
        "codigo": "1102",
        "nombre": "Chincha",
        "distritos": [
          {
            "ubigeo": "110201",
            "nombre": "Chincha Alta"
          },
          {
            "ubigeo": "110202",
            "nombre": "Alto Laran"
          },
          {
            "ubigeo": "110203",
            "nombre": "Chavin"
          },
          {
            "ubigeo": "110204",
            "nombre": "Chincha Baja"
          },
          {
            "ubigeo": "110205",
            "nombre": "El Carmen"
          },
          {
            "ubigeo": "110206",
            "nombre": "Grocio Prado"
          },
          {
            "ubigeo": "110207",
            "nombre": "Pueblo Nuevo"
          },
          {
            "ubigeo": "110208",
            "nombre": "San Juan de Yanac"
          },
          {
            "ubigeo": "110209",
            "nombre": "San Pedro de Huacarpana"
          },
          {
            "ubigeo": "110210",
            "nombre": "Sunampe"
          },
          {
            "ubigeo": "110211",
            "nombre": "Tambo de Mora"
          }
        ]
      },
      {
        "codigo": "1103",
        "nombre": "Nazca",
        "distritos": [
          {
            "ubigeo": "110301",
            "nombre": "Nazca"
          },
          {
            "ubigeo": "110302",
            "nombre": "Changuillo"
          },
          {
            "ubigeo": "110303",
            "nombre": "El Ingenio"
          },
          {
            "ubigeo": "110304",
            "nombre": "Marcona"
          },
          {
            "ubigeo": "110305",
            "nombre": "Vista Alegre"
          }
        ]
      },
      {
        "codigo": "1104",
        "nombre": "Palpa",
        "distritos": [
          {
            "ubigeo": "110401",
            "nombre": "Palpa"
          },
          {
            "ubigeo": "110402",
            "nombre": "Llipata"
          },
          {
            "ubigeo": "110403",
            "nombre": "Rio Grande"
          },
          {
            "ubigeo": "110404",
            "nombre": "Santa Cruz"
          },
          {
            "ubigeo": "110405",
            "nombre": "Tibillo"
          }
        ]
      },
      {
        "codigo": "1105",
        "nombre": "Pisco",
        "distritos": [
          {
            "ubigeo": "110501",
            "nombre": "Pisco"
          },
          {
            "ubigeo": "110502",
            "nombre": "Huancano"
          },
          {
            "ubigeo": "110503",
            "nombre": "Humay"
          },
          {
            "ubigeo": "110504",
            "nombre": "Independencia"
          },
          {
            "ubigeo": "110505",
            "nombre": "Paracas"
          },
          {
            "ubigeo": "110506",
            "nombre": "San Andrés"
          },
          {
            "ubigeo": "110507",
            "nombre": "San Clemente"
          },
          {
            "ubigeo": "110508",
            "nombre": "Tupac Amaru Inca"
          }
        ]
      }
    ]
  },
  {
    "codigo": "12",
    "nombre": "Junín",
    "provincias": [
      {
        "codigo": "1201",
        "nombre": "Huancayo",
        "distritos": [
          {
            "ubigeo": "120101",
            "nombre": "Huancayo"
          },
          {
            "ubigeo": "120104",
            "nombre": "Carhuacallanga"
          },
          {
            "ubigeo": "120105",
            "nombre": "Chacapampa"
          },
          {
            "ubigeo": "120106",
            "nombre": "Chicche"
          },
          {
            "ubigeo": "120107",
            "nombre": "Chilca"
          },
          {
            "ubigeo": "120108",
            "nombre": "Chongos Alto"
          },
          {
            "ubigeo": "120111",
            "nombre": "Chupuro"
          },
          {
            "ubigeo": "120112",
            "nombre": "Colca"
          },
          {
            "ubigeo": "120113",
            "nombre": "Cullhuas"
          },
          {
            "ubigeo": "120114",
            "nombre": "El Tambo"
          },
          {
            "ubigeo": "120116",
            "nombre": "Huacrapuquio"
          },
          {
            "ubigeo": "120117",
            "nombre": "Hualhuas"
          },
          {
            "ubigeo": "120119",
            "nombre": "Huancan"
          },
          {
            "ubigeo": "120120",
            "nombre": "Huasicancha"
          },
          {
            "ubigeo": "120121",
            "nombre": "Huayucachi"
          },
          {
            "ubigeo": "120122",
            "nombre": "Ingenio"
          },
          {
            "ubigeo": "120124",
            "nombre": "Pariahuanca"
          },
          {
            "ubigeo": "120125",
            "nombre": "Pilcomayo"
          },
          {
            "ubigeo": "120126",
            "nombre": "Pucara"
          },
          {
            "ubigeo": "120127",
            "nombre": "Quichuay"
          },
          {
            "ubigeo": "120128",
            "nombre": "Quilcas"
          },
          {
            "ubigeo": "120129",
            "nombre": "San Agustín"
          },
          {
            "ubigeo": "120130",
            "nombre": "San Jerónimo de Tunan"
          },
          {
            "ubigeo": "120132",
            "nombre": "Saño"
          },
          {
            "ubigeo": "120133",
            "nombre": "Sapallanga"
          },
          {
            "ubigeo": "120134",
            "nombre": "Sicaya"
          },
          {
            "ubigeo": "120135",
            "nombre": "Santo Domingo de Acobamba"
          },
          {
            "ubigeo": "120136",
            "nombre": "Viques"
          }
        ]
      },
      {
        "codigo": "1202",
        "nombre": "Concepcion",
        "distritos": [
          {
            "ubigeo": "120201",
            "nombre": "Concepcion"
          },
          {
            "ubigeo": "120202",
            "nombre": "Aco"
          },
          {
            "ubigeo": "120203",
            "nombre": "Andamarca"
          },
          {
            "ubigeo": "120204",
            "nombre": "Chambara"
          },
          {
            "ubigeo": "120205",
            "nombre": "Cochas"
          },
          {
            "ubigeo": "120206",
            "nombre": "Comas"
          },
          {
            "ubigeo": "120207",
            "nombre": "Heroínas Toledo"
          },
          {
            "ubigeo": "120208",
            "nombre": "Manzanares"
          },
          {
            "ubigeo": "120209",
            "nombre": "Mariscal Castilla"
          },
          {
            "ubigeo": "120210",
            "nombre": "Matahuasi"
          },
          {
            "ubigeo": "120211",
            "nombre": "Mito"
          },
          {
            "ubigeo": "120212",
            "nombre": "Nueve de Julio"
          },
          {
            "ubigeo": "120213",
            "nombre": "Orcotuna"
          },
          {
            "ubigeo": "120214",
            "nombre": "San Jose de Quero"
          },
          {
            "ubigeo": "120215",
            "nombre": "Santa Rosa de Ocopa"
          }
        ]
      },
      {
        "codigo": "1203",
        "nombre": "Chanchamayo",
        "distritos": [
          {
            "ubigeo": "120301",
            "nombre": "Chanchamayo"
          },
          {
            "ubigeo": "120302",
            "nombre": "Perene"
          },
          {
            "ubigeo": "120303",
            "nombre": "Pichanaqui"
          },
          {
            "ubigeo": "120304",
            "nombre": "San Luis de Shuaro"
          },
          {
            "ubigeo": "120305",
            "nombre": "San Ramón"
          },
          {
            "ubigeo": "120306",
            "nombre": "Vitoc"
          }
        ]
      },
      {
        "codigo": "1204",
        "nombre": "Jauja",
        "distritos": [
          {
            "ubigeo": "120401",
            "nombre": "Jauja"
          },
          {
            "ubigeo": "120402",
            "nombre": "Acolla"
          },
          {
            "ubigeo": "120403",
            "nombre": "Apata"
          },
          {
            "ubigeo": "120404",
            "nombre": "Ataura"
          },
          {
            "ubigeo": "120405",
            "nombre": "Canchayllo"
          },
          {
            "ubigeo": "120406",
            "nombre": "Curicaca"
          },
          {
            "ubigeo": "120407",
            "nombre": "El Mantaro"
          },
          {
            "ubigeo": "120408",
            "nombre": "Huamali"
          },
          {
            "ubigeo": "120409",
            "nombre": "Huaripampa"
          },
          {
            "ubigeo": "120410",
            "nombre": "Huertas"
          },
          {
            "ubigeo": "120411",
            "nombre": "Janjaillo"
          },
          {
            "ubigeo": "120412",
            "nombre": "Julcan"
          },
          {
            "ubigeo": "120413",
            "nombre": "Leonor Ordóñez"
          },
          {
            "ubigeo": "120414",
            "nombre": "Llocllapampa"
          },
          {
            "ubigeo": "120415",
            "nombre": "Marco"
          },
          {
            "ubigeo": "120416",
            "nombre": "Masma"
          },
          {
            "ubigeo": "120417",
            "nombre": "Masma Chicche"
          },
          {
            "ubigeo": "120418",
            "nombre": "Molinos"
          },
          {
            "ubigeo": "120419",
            "nombre": "Monobamba"
          },
          {
            "ubigeo": "120420",
            "nombre": "Muqui"
          },
          {
            "ubigeo": "120421",
            "nombre": "Muquiyauyo"
          },
          {
            "ubigeo": "120422",
            "nombre": "Paca"
          },
          {
            "ubigeo": "120423",
            "nombre": "Paccha"
          },
          {
            "ubigeo": "120424",
            "nombre": "Pancan"
          },
          {
            "ubigeo": "120425",
            "nombre": "Parco"
          },
          {
            "ubigeo": "120426",
            "nombre": "Pomacancha"
          },
          {
            "ubigeo": "120427",
            "nombre": "Ricran"
          },
          {
            "ubigeo": "120428",
            "nombre": "San Lorenzo"
          },
          {
            "ubigeo": "120429",
            "nombre": "San Pedro de Chunan"
          },
          {
            "ubigeo": "120430",
            "nombre": "Sausa"
          },
          {
            "ubigeo": "120431",
            "nombre": "Sincos"
          },
          {
            "ubigeo": "120432",
            "nombre": "Tunan Marca"
          },
          {
            "ubigeo": "120433",
            "nombre": "Yauli"
          },
          {
            "ubigeo": "120434",
            "nombre": "Yauyos"
          }
        ]
      },
      {
        "codigo": "1205",
        "nombre": "Junín",
        "distritos": [
          {
            "ubigeo": "120501",
            "nombre": "Junín"
          },
          {
            "ubigeo": "120502",
            "nombre": "Carhuamayo"
          },
          {
            "ubigeo": "120503",
            "nombre": "Ondores"
          },
          {
            "ubigeo": "120504",
            "nombre": "Ulcumayo"
          }
        ]
      },
      {
        "codigo": "1206",
        "nombre": "Satipo",
        "distritos": [
          {
            "ubigeo": "120601",
            "nombre": "Satipo"
          },
          {
            "ubigeo": "120602",
            "nombre": "Coviriali"
          },
          {
            "ubigeo": "120603",
            "nombre": "Llaylla"
          },
          {
            "ubigeo": "120604",
            "nombre": "Mazamari"
          },
          {
            "ubigeo": "120605",
            "nombre": "Pampa Hermosa"
          },
          {
            "ubigeo": "120606",
            "nombre": "Pangoa"
          },
          {
            "ubigeo": "120607",
            "nombre": "Rio Negro"
          },
          {
            "ubigeo": "120608",
            "nombre": "Rio Tambo"
          },
          {
            "ubigeo": "120609",
            "nombre": "Vizcatan del Ene"
          }
        ]
      },
      {
        "codigo": "1207",
        "nombre": "Tarma",
        "distritos": [
          {
            "ubigeo": "120701",
            "nombre": "Tarma"
          },
          {
            "ubigeo": "120702",
            "nombre": "Acobamba"
          },
          {
            "ubigeo": "120703",
            "nombre": "Huaricolca"
          },
          {
            "ubigeo": "120704",
            "nombre": "Huasahuasi"
          },
          {
            "ubigeo": "120705",
            "nombre": "La Union"
          },
          {
            "ubigeo": "120706",
            "nombre": "Palca"
          },
          {
            "ubigeo": "120707",
            "nombre": "Palcamayo"
          },
          {
            "ubigeo": "120708",
            "nombre": "San Pedro de Cajas"
          },
          {
            "ubigeo": "120709",
            "nombre": "Tapo"
          }
        ]
      },
      {
        "codigo": "1208",
        "nombre": "Yauli",
        "distritos": [
          {
            "ubigeo": "120801",
            "nombre": "La Oroya"
          },
          {
            "ubigeo": "120802",
            "nombre": "Chacapalpa"
          },
          {
            "ubigeo": "120803",
            "nombre": "Huay-Huay"
          },
          {
            "ubigeo": "120804",
            "nombre": "Marcapomacocha"
          },
          {
            "ubigeo": "120805",
            "nombre": "Morococha"
          },
          {
            "ubigeo": "120806",
            "nombre": "Paccha"
          },
          {
            "ubigeo": "120807",
            "nombre": "Santa Barbara de Carhuacayan"
          },
          {
            "ubigeo": "120808",
            "nombre": "Santa Rosa de Sacco"
          },
          {
            "ubigeo": "120809",
            "nombre": "Suitucancha"
          },
          {
            "ubigeo": "120810",
            "nombre": "Yauli"
          }
        ]
      },
      {
        "codigo": "1209",
        "nombre": "Chupaca",
        "distritos": [
          {
            "ubigeo": "120901",
            "nombre": "Chupaca"
          },
          {
            "ubigeo": "120902",
            "nombre": "Ahuac"
          },
          {
            "ubigeo": "120903",
            "nombre": "Chongos Bajo"
          },
          {
            "ubigeo": "120904",
            "nombre": "Huachac"
          },
          {
            "ubigeo": "120905",
            "nombre": "Huamancaca Chico"
          },
          {
            "ubigeo": "120906",
            "nombre": "San Juan de Yscos"
          },
          {
            "ubigeo": "120907",
            "nombre": "San Juan de Jarpa"
          },
          {
            "ubigeo": "120908",
            "nombre": "Tres de Diciembre"
          },
          {
            "ubigeo": "120909",
            "nombre": "Yanacancha"
          }
        ]
      }
    ]
  },
  {
    "codigo": "13",
    "nombre": "La Libertad",
    "provincias": [
      {
        "codigo": "1301",
        "nombre": "Trujillo",
        "distritos": [
          {
            "ubigeo": "130101",
            "nombre": "Trujillo"
          },
          {
            "ubigeo": "130102",
            "nombre": "El Porvenir"
          },
          {
            "ubigeo": "130103",
            "nombre": "Florencia de Mora"
          },
          {
            "ubigeo": "130104",
            "nombre": "Huanchaco"
          },
          {
            "ubigeo": "130105",
            "nombre": "La Esperanza"
          },
          {
            "ubigeo": "130106",
            "nombre": "Laredo"
          },
          {
            "ubigeo": "130107",
            "nombre": "Moche"
          },
          {
            "ubigeo": "130108",
            "nombre": "Poroto"
          },
          {
            "ubigeo": "130109",
            "nombre": "Salaverry"
          },
          {
            "ubigeo": "130110",
            "nombre": "Simbal"
          },
          {
            "ubigeo": "130111",
            "nombre": "Victor Larco Herrera"
          }
        ]
      },
      {
        "codigo": "1302",
        "nombre": "Ascope",
        "distritos": [
          {
            "ubigeo": "130201",
            "nombre": "Ascope"
          },
          {
            "ubigeo": "130202",
            "nombre": "Chicama"
          },
          {
            "ubigeo": "130203",
            "nombre": "Chocope"
          },
          {
            "ubigeo": "130204",
            "nombre": "Magdalena de Cao"
          },
          {
            "ubigeo": "130205",
            "nombre": "Paijan"
          },
          {
            "ubigeo": "130206",
            "nombre": "Rázuri"
          },
          {
            "ubigeo": "130207",
            "nombre": "Santiago de Cao"
          },
          {
            "ubigeo": "130208",
            "nombre": "Casa Grande"
          }
        ]
      },
      {
        "codigo": "1303",
        "nombre": "Bolivar",
        "distritos": [
          {
            "ubigeo": "130301",
            "nombre": "Bolivar"
          },
          {
            "ubigeo": "130302",
            "nombre": "Bambamarca"
          },
          {
            "ubigeo": "130303",
            "nombre": "Condormarca"
          },
          {
            "ubigeo": "130304",
            "nombre": "Longotea"
          },
          {
            "ubigeo": "130305",
            "nombre": "Uchumarca"
          },
          {
            "ubigeo": "130306",
            "nombre": "Ucuncha"
          }
        ]
      },
      {
        "codigo": "1304",
        "nombre": "Chepén",
        "distritos": [
          {
            "ubigeo": "130401",
            "nombre": "Chepén"
          },
          {
            "ubigeo": "130402",
            "nombre": "Pacanga"
          },
          {
            "ubigeo": "130403",
            "nombre": "Pueblo Nuevo"
          }
        ]
      },
      {
        "codigo": "1305",
        "nombre": "Julcan",
        "distritos": [
          {
            "ubigeo": "130501",
            "nombre": "Julcan"
          },
          {
            "ubigeo": "130502",
            "nombre": "Calamarca"
          },
          {
            "ubigeo": "130503",
            "nombre": "Carabamba"
          },
          {
            "ubigeo": "130504",
            "nombre": "Huaso"
          }
        ]
      },
      {
        "codigo": "1306",
        "nombre": "Otuzco",
        "distritos": [
          {
            "ubigeo": "130601",
            "nombre": "Otuzco"
          },
          {
            "ubigeo": "130602",
            "nombre": "Agallpampa"
          },
          {
            "ubigeo": "130604",
            "nombre": "Charat"
          },
          {
            "ubigeo": "130605",
            "nombre": "Huaranchal"
          },
          {
            "ubigeo": "130606",
            "nombre": "La Cuesta"
          },
          {
            "ubigeo": "130608",
            "nombre": "Mache"
          },
          {
            "ubigeo": "130610",
            "nombre": "Paranday"
          },
          {
            "ubigeo": "130611",
            "nombre": "Salpo"
          },
          {
            "ubigeo": "130613",
            "nombre": "Sinsicap"
          },
          {
            "ubigeo": "130614",
            "nombre": "Usquil"
          }
        ]
      },
      {
        "codigo": "1307",
        "nombre": "Pacasmayo",
        "distritos": [
          {
            "ubigeo": "130701",
            "nombre": "San Pedro de Lloc"
          },
          {
            "ubigeo": "130702",
            "nombre": "Guadalupe"
          },
          {
            "ubigeo": "130703",
            "nombre": "Jequetepeque"
          },
          {
            "ubigeo": "130704",
            "nombre": "Pacasmayo"
          },
          {
            "ubigeo": "130705",
            "nombre": "San Jose"
          }
        ]
      },
      {
        "codigo": "1308",
        "nombre": "Pataz",
        "distritos": [
          {
            "ubigeo": "130801",
            "nombre": "Tayabamba"
          },
          {
            "ubigeo": "130802",
            "nombre": "Buldibuyo"
          },
          {
            "ubigeo": "130803",
            "nombre": "Chillia"
          },
          {
            "ubigeo": "130804",
            "nombre": "Huancaspata"
          },
          {
            "ubigeo": "130805",
            "nombre": "Huaylillas"
          },
          {
            "ubigeo": "130806",
            "nombre": "Huayo"
          },
          {
            "ubigeo": "130807",
            "nombre": "Ongon"
          },
          {
            "ubigeo": "130808",
            "nombre": "Parcoy"
          },
          {
            "ubigeo": "130809",
            "nombre": "Pataz"
          },
          {
            "ubigeo": "130810",
            "nombre": "Pias"
          },
          {
            "ubigeo": "130811",
            "nombre": "Santiago de Challas"
          },
          {
            "ubigeo": "130812",
            "nombre": "Taurija"
          },
          {
            "ubigeo": "130813",
            "nombre": "Urpay"
          }
        ]
      },
      {
        "codigo": "1309",
        "nombre": "Sánchez Carrión",
        "distritos": [
          {
            "ubigeo": "130901",
            "nombre": "Huamachuco"
          },
          {
            "ubigeo": "130902",
            "nombre": "Chugay"
          },
          {
            "ubigeo": "130903",
            "nombre": "Cochorco"
          },
          {
            "ubigeo": "130904",
            "nombre": "Curgos"
          },
          {
            "ubigeo": "130905",
            "nombre": "Marcabal"
          },
          {
            "ubigeo": "130906",
            "nombre": "Sanagoran"
          },
          {
            "ubigeo": "130907",
            "nombre": "Sarin"
          },
          {
            "ubigeo": "130908",
            "nombre": "Sartimbamba"
          }
        ]
      },
      {
        "codigo": "1310",
        "nombre": "Santiago de Chuco",
        "distritos": [
          {
            "ubigeo": "131001",
            "nombre": "Santiago de Chuco"
          },
          {
            "ubigeo": "131002",
            "nombre": "Angasmarca"
          },
          {
            "ubigeo": "131003",
            "nombre": "Cachicadan"
          },
          {
            "ubigeo": "131004",
            "nombre": "Mollebamba"
          },
          {
            "ubigeo": "131005",
            "nombre": "Mollepata"
          },
          {
            "ubigeo": "131006",
            "nombre": "Quiruvilca"
          },
          {
            "ubigeo": "131007",
            "nombre": "Santa Cruz de Chuca"
          },
          {
            "ubigeo": "131008",
            "nombre": "Sitabamba"
          }
        ]
      },
      {
        "codigo": "1311",
        "nombre": "Gran Chimú",
        "distritos": [
          {
            "ubigeo": "131101",
            "nombre": "Cascas"
          },
          {
            "ubigeo": "131102",
            "nombre": "Lucma"
          },
          {
            "ubigeo": "131103",
            "nombre": "Compin"
          },
          {
            "ubigeo": "131104",
            "nombre": "Sayapullo"
          }
        ]
      },
      {
        "codigo": "1312",
        "nombre": "Virú",
        "distritos": [
          {
            "ubigeo": "131201",
            "nombre": "Virú"
          },
          {
            "ubigeo": "131202",
            "nombre": "Chao"
          },
          {
            "ubigeo": "131203",
            "nombre": "Guadalupito"
          }
        ]
      }
    ]
  },
  {
    "codigo": "14",
    "nombre": "Lambayeque",
    "provincias": [
      {
        "codigo": "1401",
        "nombre": "Chiclayo",
        "distritos": [
          {
            "ubigeo": "140101",
            "nombre": "Chiclayo"
          },
          {
            "ubigeo": "140102",
            "nombre": "Chongoyape"
          },
          {
            "ubigeo": "140103",
            "nombre": "Eten"
          },
          {
            "ubigeo": "140104",
            "nombre": "Eten Puerto"
          },
          {
            "ubigeo": "140105",
            "nombre": "Jose Leonardo Ortiz"
          },
          {
            "ubigeo": "140106",
            "nombre": "La Victoria"
          },
          {
            "ubigeo": "140107",
            "nombre": "Lagunas"
          },
          {
            "ubigeo": "140108",
            "nombre": "Monsefu"
          },
          {
            "ubigeo": "140109",
            "nombre": "Nueva Arica"
          },
          {
            "ubigeo": "140110",
            "nombre": "Oyotun"
          },
          {
            "ubigeo": "140111",
            "nombre": "Picsi"
          },
          {
            "ubigeo": "140112",
            "nombre": "Pimentel"
          },
          {
            "ubigeo": "140113",
            "nombre": "Reque"
          },
          {
            "ubigeo": "140114",
            "nombre": "Santa Rosa"
          },
          {
            "ubigeo": "140115",
            "nombre": "Saña"
          },
          {
            "ubigeo": "140116",
            "nombre": "Cayalti"
          },
          {
            "ubigeo": "140117",
            "nombre": "Patapo"
          },
          {
            "ubigeo": "140118",
            "nombre": "Pomalca"
          },
          {
            "ubigeo": "140119",
            "nombre": "Pucala"
          },
          {
            "ubigeo": "140120",
            "nombre": "Tuman"
          }
        ]
      },
      {
        "codigo": "1402",
        "nombre": "Ferreñafe",
        "distritos": [
          {
            "ubigeo": "140201",
            "nombre": "Ferreñafe"
          },
          {
            "ubigeo": "140202",
            "nombre": "Cañaris"
          },
          {
            "ubigeo": "140203",
            "nombre": "Incahuasi"
          },
          {
            "ubigeo": "140204",
            "nombre": "Manuel Antonio Mesones Muro"
          },
          {
            "ubigeo": "140205",
            "nombre": "Pitipo"
          },
          {
            "ubigeo": "140206",
            "nombre": "Pueblo Nuevo"
          }
        ]
      },
      {
        "codigo": "1403",
        "nombre": "Lambayeque",
        "distritos": [
          {
            "ubigeo": "140301",
            "nombre": "Lambayeque"
          },
          {
            "ubigeo": "140302",
            "nombre": "Chochope"
          },
          {
            "ubigeo": "140303",
            "nombre": "Illimo"
          },
          {
            "ubigeo": "140304",
            "nombre": "Jayanca"
          },
          {
            "ubigeo": "140305",
            "nombre": "Mochumi"
          },
          {
            "ubigeo": "140306",
            "nombre": "Morrope"
          },
          {
            "ubigeo": "140307",
            "nombre": "Motupe"
          },
          {
            "ubigeo": "140308",
            "nombre": "Olmos"
          },
          {
            "ubigeo": "140309",
            "nombre": "Pacora"
          },
          {
            "ubigeo": "140310",
            "nombre": "Salas"
          },
          {
            "ubigeo": "140311",
            "nombre": "San Jose"
          },
          {
            "ubigeo": "140312",
            "nombre": "Tucume"
          }
        ]
      }
    ]
  },
  {
    "codigo": "15",
    "nombre": "Lima",
    "provincias": [
      {
        "codigo": "1501",
        "nombre": "Lima",
        "distritos": [
          {
            "ubigeo": "150101",
            "nombre": "Lima"
          },
          {
            "ubigeo": "150102",
            "nombre": "Ancón"
          },
          {
            "ubigeo": "150103",
            "nombre": "Ate"
          },
          {
            "ubigeo": "150104",
            "nombre": "Barranco"
          },
          {
            "ubigeo": "150105",
            "nombre": "Breña"
          },
          {
            "ubigeo": "150106",
            "nombre": "Carabayllo"
          },
          {
            "ubigeo": "150107",
            "nombre": "Chaclacayo"
          },
          {
            "ubigeo": "150108",
            "nombre": "Chorrillos"
          },
          {
            "ubigeo": "150109",
            "nombre": "Cieneguilla"
          },
          {
            "ubigeo": "150110",
            "nombre": "Comas"
          },
          {
            "ubigeo": "150111",
            "nombre": "El Agustino"
          },
          {
            "ubigeo": "150112",
            "nombre": "Independencia"
          },
          {
            "ubigeo": "150113",
            "nombre": "Jesus Maria"
          },
          {
            "ubigeo": "150114",
            "nombre": "La Molina"
          },
          {
            "ubigeo": "150115",
            "nombre": "La Victoria"
          },
          {
            "ubigeo": "150116",
            "nombre": "Lince"
          },
          {
            "ubigeo": "150117",
            "nombre": "Los Olivos"
          },
          {
            "ubigeo": "150118",
            "nombre": "Lurigancho"
          },
          {
            "ubigeo": "150119",
            "nombre": "Lurin"
          },
          {
            "ubigeo": "150120",
            "nombre": "Magdalena del Mar"
          },
          {
            "ubigeo": "150121",
            "nombre": "Pueblo Libre"
          },
          {
            "ubigeo": "150122",
            "nombre": "Miraflores"
          },
          {
            "ubigeo": "150123",
            "nombre": "Pachacamac"
          },
          {
            "ubigeo": "150124",
            "nombre": "Pucusana"
          },
          {
            "ubigeo": "150125",
            "nombre": "Puente Piedra"
          },
          {
            "ubigeo": "150126",
            "nombre": "Punta Hermosa"
          },
          {
            "ubigeo": "150127",
            "nombre": "Punta Negra"
          },
          {
            "ubigeo": "150128",
            "nombre": "Rímac"
          },
          {
            "ubigeo": "150129",
            "nombre": "San Bartolo"
          },
          {
            "ubigeo": "150130",
            "nombre": "San Borja"
          },
          {
            "ubigeo": "150131",
            "nombre": "San Isidro"
          },
          {
            "ubigeo": "150132",
            "nombre": "San Juan de Lurigancho"
          },
          {
            "ubigeo": "150133",
            "nombre": "San Juan de Miraflores"
          },
          {
            "ubigeo": "150134",
            "nombre": "San Luis"
          },
          {
            "ubigeo": "150135",
            "nombre": "San Martín de Porres"
          },
          {
            "ubigeo": "150136",
            "nombre": "San Miguel"
          },
          {
            "ubigeo": "150137",
            "nombre": "Santa Anita"
          },
          {
            "ubigeo": "150138",
            "nombre": "Santa Maria del Mar"
          },
          {
            "ubigeo": "150139",
            "nombre": "Santa Rosa"
          },
          {
            "ubigeo": "150140",
            "nombre": "Santiago de Surco"
          },
          {
            "ubigeo": "150141",
            "nombre": "Surquillo"
          },
          {
            "ubigeo": "150142",
            "nombre": "Villa El Salvador"
          },
          {
            "ubigeo": "150143",
            "nombre": "Villa Maria del Triunfo"
          }
        ]
      },
      {
        "codigo": "1502",
        "nombre": "Barranca",
        "distritos": [
          {
            "ubigeo": "150201",
            "nombre": "Barranca"
          },
          {
            "ubigeo": "150202",
            "nombre": "Paramonga"
          },
          {
            "ubigeo": "150203",
            "nombre": "Pativilca"
          },
          {
            "ubigeo": "150204",
            "nombre": "Supe"
          },
          {
            "ubigeo": "150205",
            "nombre": "Supe Puerto"
          }
        ]
      },
      {
        "codigo": "1503",
        "nombre": "Cajatambo",
        "distritos": [
          {
            "ubigeo": "150301",
            "nombre": "Cajatambo"
          },
          {
            "ubigeo": "150302",
            "nombre": "Copa"
          },
          {
            "ubigeo": "150303",
            "nombre": "Gorgor"
          },
          {
            "ubigeo": "150304",
            "nombre": "Huancapon"
          },
          {
            "ubigeo": "150305",
            "nombre": "Manas"
          }
        ]
      },
      {
        "codigo": "1504",
        "nombre": "Canta",
        "distritos": [
          {
            "ubigeo": "150401",
            "nombre": "Canta"
          },
          {
            "ubigeo": "150402",
            "nombre": "Arahuay"
          },
          {
            "ubigeo": "150403",
            "nombre": "Huamantanga"
          },
          {
            "ubigeo": "150404",
            "nombre": "Huaros"
          },
          {
            "ubigeo": "150405",
            "nombre": "Lachaqui"
          },
          {
            "ubigeo": "150406",
            "nombre": "San Buenaventura"
          },
          {
            "ubigeo": "150407",
            "nombre": "Santa Rosa de Quives"
          }
        ]
      },
      {
        "codigo": "1505",
        "nombre": "Cañete",
        "distritos": [
          {
            "ubigeo": "150501",
            "nombre": "San Vicente de Cañete"
          },
          {
            "ubigeo": "150502",
            "nombre": "Asia"
          },
          {
            "ubigeo": "150503",
            "nombre": "Calango"
          },
          {
            "ubigeo": "150504",
            "nombre": "Cerro Azul"
          },
          {
            "ubigeo": "150505",
            "nombre": "Chilca"
          },
          {
            "ubigeo": "150506",
            "nombre": "Coayllo"
          },
          {
            "ubigeo": "150507",
            "nombre": "Imperial"
          },
          {
            "ubigeo": "150508",
            "nombre": "Lunahuana"
          },
          {
            "ubigeo": "150509",
            "nombre": "Mala"
          },
          {
            "ubigeo": "150510",
            "nombre": "Nuevo Imperial"
          },
          {
            "ubigeo": "150511",
            "nombre": "Pacaran"
          },
          {
            "ubigeo": "150512",
            "nombre": "Quilmana"
          },
          {
            "ubigeo": "150513",
            "nombre": "San Antonio"
          },
          {
            "ubigeo": "150514",
            "nombre": "San Luis"
          },
          {
            "ubigeo": "150515",
            "nombre": "Santa Cruz de Flores"
          },
          {
            "ubigeo": "150516",
            "nombre": "Zúñiga"
          }
        ]
      },
      {
        "codigo": "1506",
        "nombre": "Huaral",
        "distritos": [
          {
            "ubigeo": "150601",
            "nombre": "Huaral"
          },
          {
            "ubigeo": "150602",
            "nombre": "Atavillos Alto"
          },
          {
            "ubigeo": "150603",
            "nombre": "Atavillos Bajo"
          },
          {
            "ubigeo": "150604",
            "nombre": "Aucallama"
          },
          {
            "ubigeo": "150605",
            "nombre": "Chancay"
          },
          {
            "ubigeo": "150606",
            "nombre": "Ihuari"
          },
          {
            "ubigeo": "150607",
            "nombre": "Lampian"
          },
          {
            "ubigeo": "150608",
            "nombre": "Pacaraos"
          },
          {
            "ubigeo": "150609",
            "nombre": "San Miguel de Acos"
          },
          {
            "ubigeo": "150610",
            "nombre": "Santa Cruz de Andamarca"
          },
          {
            "ubigeo": "150611",
            "nombre": "Sumbilca"
          },
          {
            "ubigeo": "150612",
            "nombre": "Veintisiete de Noviembre"
          }
        ]
      },
      {
        "codigo": "1507",
        "nombre": "Huarochiri",
        "distritos": [
          {
            "ubigeo": "150701",
            "nombre": "Matucana"
          },
          {
            "ubigeo": "150702",
            "nombre": "Antioquia"
          },
          {
            "ubigeo": "150703",
            "nombre": "Callahuanca"
          },
          {
            "ubigeo": "150704",
            "nombre": "Carampoma"
          },
          {
            "ubigeo": "150705",
            "nombre": "Chicla"
          },
          {
            "ubigeo": "150706",
            "nombre": "Cuenca"
          },
          {
            "ubigeo": "150707",
            "nombre": "Huachupampa"
          },
          {
            "ubigeo": "150708",
            "nombre": "Huanza"
          },
          {
            "ubigeo": "150709",
            "nombre": "Huarochiri"
          },
          {
            "ubigeo": "150710",
            "nombre": "Lahuaytambo"
          },
          {
            "ubigeo": "150711",
            "nombre": "Langa"
          },
          {
            "ubigeo": "150712",
            "nombre": "Laraos"
          },
          {
            "ubigeo": "150713",
            "nombre": "Mariatana"
          },
          {
            "ubigeo": "150714",
            "nombre": "Ricardo Palma"
          },
          {
            "ubigeo": "150715",
            "nombre": "San Andrés de Tupicocha"
          },
          {
            "ubigeo": "150716",
            "nombre": "San Antonio"
          },
          {
            "ubigeo": "150717",
            "nombre": "San Bartolomé"
          },
          {
            "ubigeo": "150718",
            "nombre": "San Damian"
          },
          {
            "ubigeo": "150719",
            "nombre": "San Juan de Iris"
          },
          {
            "ubigeo": "150720",
            "nombre": "San Juan de Tantaranche"
          },
          {
            "ubigeo": "150721",
            "nombre": "San Lorenzo de Quinti"
          },
          {
            "ubigeo": "150722",
            "nombre": "San Mateo"
          },
          {
            "ubigeo": "150723",
            "nombre": "San Mateo de Otao"
          },
          {
            "ubigeo": "150724",
            "nombre": "San Pedro de Casta"
          },
          {
            "ubigeo": "150725",
            "nombre": "San Pedro de Huancayre"
          },
          {
            "ubigeo": "150726",
            "nombre": "Sangallaya"
          },
          {
            "ubigeo": "150727",
            "nombre": "Santa Cruz de Cocachacra"
          },
          {
            "ubigeo": "150728",
            "nombre": "Santa Eulalia"
          },
          {
            "ubigeo": "150729",
            "nombre": "Santiago de Anchucaya"
          },
          {
            "ubigeo": "150730",
            "nombre": "Santiago de Tuna"
          },
          {
            "ubigeo": "150731",
            "nombre": "Santo Domingo de los Olleros"
          },
          {
            "ubigeo": "150732",
            "nombre": "Surco"
          }
        ]
      },
      {
        "codigo": "1508",
        "nombre": "Huaura",
        "distritos": [
          {
            "ubigeo": "150801",
            "nombre": "Huacho"
          },
          {
            "ubigeo": "150802",
            "nombre": "Ambar"
          },
          {
            "ubigeo": "150803",
            "nombre": "Caleta de Carquin"
          },
          {
            "ubigeo": "150804",
            "nombre": "Checras"
          },
          {
            "ubigeo": "150805",
            "nombre": "Hualmay"
          },
          {
            "ubigeo": "150806",
            "nombre": "Huaura"
          },
          {
            "ubigeo": "150807",
            "nombre": "Leoncio Prado"
          },
          {
            "ubigeo": "150808",
            "nombre": "Paccho"
          },
          {
            "ubigeo": "150809",
            "nombre": "Santa Leonor"
          },
          {
            "ubigeo": "150810",
            "nombre": "Santa Maria"
          },
          {
            "ubigeo": "150811",
            "nombre": "Sayan"
          },
          {
            "ubigeo": "150812",
            "nombre": "Vegueta"
          }
        ]
      },
      {
        "codigo": "1509",
        "nombre": "Oyon",
        "distritos": [
          {
            "ubigeo": "150901",
            "nombre": "Oyon"
          },
          {
            "ubigeo": "150902",
            "nombre": "Andajes"
          },
          {
            "ubigeo": "150903",
            "nombre": "Caujul"
          },
          {
            "ubigeo": "150904",
            "nombre": "Cochamarca"
          },
          {
            "ubigeo": "150905",
            "nombre": "Navan"
          },
          {
            "ubigeo": "150906",
            "nombre": "Pachangara"
          }
        ]
      },
      {
        "codigo": "1510",
        "nombre": "Yauyos",
        "distritos": [
          {
            "ubigeo": "151001",
            "nombre": "Yauyos"
          },
          {
            "ubigeo": "151002",
            "nombre": "Alis"
          },
          {
            "ubigeo": "151003",
            "nombre": "Ayauca"
          },
          {
            "ubigeo": "151004",
            "nombre": "Ayaviri"
          },
          {
            "ubigeo": "151005",
            "nombre": "Azángaro"
          },
          {
            "ubigeo": "151006",
            "nombre": "Cacra"
          },
          {
            "ubigeo": "151007",
            "nombre": "Carania"
          },
          {
            "ubigeo": "151008",
            "nombre": "Catahuasi"
          },
          {
            "ubigeo": "151009",
            "nombre": "Chocos"
          },
          {
            "ubigeo": "151010",
            "nombre": "Cochas"
          },
          {
            "ubigeo": "151011",
            "nombre": "Colonia"
          },
          {
            "ubigeo": "151012",
            "nombre": "Hongos"
          },
          {
            "ubigeo": "151013",
            "nombre": "Huampara"
          },
          {
            "ubigeo": "151014",
            "nombre": "Huancaya"
          },
          {
            "ubigeo": "151015",
            "nombre": "Huangascar"
          },
          {
            "ubigeo": "151016",
            "nombre": "Huantan"
          },
          {
            "ubigeo": "151017",
            "nombre": "Huañec"
          },
          {
            "ubigeo": "151018",
            "nombre": "Laraos"
          },
          {
            "ubigeo": "151019",
            "nombre": "Lincha"
          },
          {
            "ubigeo": "151020",
            "nombre": "Madean"
          },
          {
            "ubigeo": "151021",
            "nombre": "Miraflores"
          },
          {
            "ubigeo": "151022",
            "nombre": "Omas"
          },
          {
            "ubigeo": "151023",
            "nombre": "Putinza"
          },
          {
            "ubigeo": "151024",
            "nombre": "Quinches"
          },
          {
            "ubigeo": "151025",
            "nombre": "Quinocay"
          },
          {
            "ubigeo": "151026",
            "nombre": "San Joaquín"
          },
          {
            "ubigeo": "151027",
            "nombre": "San Pedro de Pilas"
          },
          {
            "ubigeo": "151028",
            "nombre": "Tanta"
          },
          {
            "ubigeo": "151029",
            "nombre": "Tauripampa"
          },
          {
            "ubigeo": "151030",
            "nombre": "Tomas"
          },
          {
            "ubigeo": "151031",
            "nombre": "Tupe"
          },
          {
            "ubigeo": "151032",
            "nombre": "Viñac"
          },
          {
            "ubigeo": "151033",
            "nombre": "Vitis"
          }
        ]
      }
    ]
  },
  {
    "codigo": "16",
    "nombre": "Loreto",
    "provincias": [
      {
        "codigo": "1601",
        "nombre": "Maynas",
        "distritos": [
          {
            "ubigeo": "160101",
            "nombre": "Iquitos"
          },
          {
            "ubigeo": "160102",
            "nombre": "Alto Nanay"
          },
          {
            "ubigeo": "160103",
            "nombre": "Fernando Lores"
          },
          {
            "ubigeo": "160104",
            "nombre": "Indiana"
          },
          {
            "ubigeo": "160105",
            "nombre": "Las Amazonas"
          },
          {
            "ubigeo": "160106",
            "nombre": "Mazan"
          },
          {
            "ubigeo": "160107",
            "nombre": "Napo"
          },
          {
            "ubigeo": "160108",
            "nombre": "Punchana"
          },
          {
            "ubigeo": "160110",
            "nombre": "Torres Causana"
          },
          {
            "ubigeo": "160112",
            "nombre": "Belén"
          },
          {
            "ubigeo": "160113",
            "nombre": "San Juan Bautista"
          }
        ]
      },
      {
        "codigo": "1602",
        "nombre": "Alto Amazonas",
        "distritos": [
          {
            "ubigeo": "160201",
            "nombre": "Yurimaguas"
          },
          {
            "ubigeo": "160202",
            "nombre": "Balsapuerto"
          },
          {
            "ubigeo": "160205",
            "nombre": "Jeberos"
          },
          {
            "ubigeo": "160206",
            "nombre": "Lagunas"
          },
          {
            "ubigeo": "160210",
            "nombre": "Santa Cruz"
          },
          {
            "ubigeo": "160211",
            "nombre": "Teniente Cesar López Rojas"
          }
        ]
      },
      {
        "codigo": "1603",
        "nombre": "Loreto",
        "distritos": [
          {
            "ubigeo": "160301",
            "nombre": "Nauta"
          },
          {
            "ubigeo": "160302",
            "nombre": "Parinari"
          },
          {
            "ubigeo": "160303",
            "nombre": "Tigre"
          },
          {
            "ubigeo": "160304",
            "nombre": "Trompeteros"
          },
          {
            "ubigeo": "160305",
            "nombre": "Urarinas"
          }
        ]
      },
      {
        "codigo": "1604",
        "nombre": "Mariscal Ramón Castilla",
        "distritos": [
          {
            "ubigeo": "160401",
            "nombre": "Ramón Castilla"
          },
          {
            "ubigeo": "160402",
            "nombre": "Pebas"
          },
          {
            "ubigeo": "160403",
            "nombre": "Yavari"
          },
          {
            "ubigeo": "160404",
            "nombre": "San Pablo"
          }
        ]
      },
      {
        "codigo": "1605",
        "nombre": "Requena",
        "distritos": [
          {
            "ubigeo": "160501",
            "nombre": "Requena"
          },
          {
            "ubigeo": "160502",
            "nombre": "Alto Tapiche"
          },
          {
            "ubigeo": "160503",
            "nombre": "Capelo"
          },
          {
            "ubigeo": "160504",
            "nombre": "Emilio San Martín"
          },
          {
            "ubigeo": "160505",
            "nombre": "Maquia"
          },
          {
            "ubigeo": "160506",
            "nombre": "Puinahua"
          },
          {
            "ubigeo": "160507",
            "nombre": "Saquena"
          },
          {
            "ubigeo": "160508",
            "nombre": "Soplin"
          },
          {
            "ubigeo": "160509",
            "nombre": "Tapiche"
          },
          {
            "ubigeo": "160510",
            "nombre": "Jenaro Herrera"
          },
          {
            "ubigeo": "160511",
            "nombre": "Yaquerana"
          }
        ]
      },
      {
        "codigo": "1606",
        "nombre": "Ucayali",
        "distritos": [
          {
            "ubigeo": "160601",
            "nombre": "Contamana"
          },
          {
            "ubigeo": "160602",
            "nombre": "Inahuaya"
          },
          {
            "ubigeo": "160603",
            "nombre": "Padre Marquez"
          },
          {
            "ubigeo": "160604",
            "nombre": "Pampa Hermosa"
          },
          {
            "ubigeo": "160605",
            "nombre": "Sarayacu"
          },
          {
            "ubigeo": "160606",
            "nombre": "Vargas Guerra"
          }
        ]
      },
      {
        "codigo": "1607",
        "nombre": "Datem del Marañon",
        "distritos": [
          {
            "ubigeo": "160701",
            "nombre": "Barranca"
          },
          {
            "ubigeo": "160702",
            "nombre": "Cahuapanas"
          },
          {
            "ubigeo": "160703",
            "nombre": "Manseriche"
          },
          {
            "ubigeo": "160704",
            "nombre": "Morona"
          },
          {
            "ubigeo": "160705",
            "nombre": "Pastaza"
          },
          {
            "ubigeo": "160706",
            "nombre": "Andoas"
          }
        ]
      },
      {
        "codigo": "1608",
        "nombre": "Maynas",
        "distritos": [
          {
            "ubigeo": "160801",
            "nombre": "Putumayo"
          },
          {
            "ubigeo": "160802",
            "nombre": "Rosa Panduro"
          },
          {
            "ubigeo": "160803",
            "nombre": "Teniente Manuel Clavero"
          },
          {
            "ubigeo": "160804",
            "nombre": "Yaguas"
          }
        ]
      }
    ]
  },
  {
    "codigo": "17",
    "nombre": "Madre de Dios",
    "provincias": [
      {
        "codigo": "1701",
        "nombre": "Tambopata",
        "distritos": [
          {
            "ubigeo": "170101",
            "nombre": "Tambopata"
          },
          {
            "ubigeo": "170102",
            "nombre": "Inambari"
          },
          {
            "ubigeo": "170103",
            "nombre": "Las Piedras"
          },
          {
            "ubigeo": "170104",
            "nombre": "Laberinto"
          }
        ]
      },
      {
        "codigo": "1702",
        "nombre": "Manu",
        "distritos": [
          {
            "ubigeo": "170201",
            "nombre": "Manu"
          },
          {
            "ubigeo": "170202",
            "nombre": "Fitzcarrald"
          },
          {
            "ubigeo": "170203",
            "nombre": "Madre de Dios"
          },
          {
            "ubigeo": "170204",
            "nombre": "Huepetuhe"
          }
        ]
      },
      {
        "codigo": "1703",
        "nombre": "Tahuamanu",
        "distritos": [
          {
            "ubigeo": "170301",
            "nombre": "Iñapari"
          },
          {
            "ubigeo": "170302",
            "nombre": "Iberia"
          },
          {
            "ubigeo": "170303",
            "nombre": "Tahuamanu"
          }
        ]
      }
    ]
  },
  {
    "codigo": "18",
    "nombre": "Moquegua",
    "provincias": [
      {
        "codigo": "1801",
        "nombre": "Mariscal Nieto",
        "distritos": [
          {
            "ubigeo": "180101",
            "nombre": "Moquegua"
          },
          {
            "ubigeo": "180102",
            "nombre": "Carumas"
          },
          {
            "ubigeo": "180103",
            "nombre": "Cuchumbaya"
          },
          {
            "ubigeo": "180104",
            "nombre": "Samegua"
          },
          {
            "ubigeo": "180105",
            "nombre": "San Cristóbal"
          },
          {
            "ubigeo": "180106",
            "nombre": "Torata"
          }
        ]
      },
      {
        "codigo": "1802",
        "nombre": "General Sánchez Cerro",
        "distritos": [
          {
            "ubigeo": "180201",
            "nombre": "Omate"
          },
          {
            "ubigeo": "180202",
            "nombre": "Chojata"
          },
          {
            "ubigeo": "180203",
            "nombre": "Coalaque"
          },
          {
            "ubigeo": "180204",
            "nombre": "Ichuña"
          },
          {
            "ubigeo": "180205",
            "nombre": "La Capilla"
          },
          {
            "ubigeo": "180206",
            "nombre": "Lloque"
          },
          {
            "ubigeo": "180207",
            "nombre": "Matalaque"
          },
          {
            "ubigeo": "180208",
            "nombre": "Puquina"
          },
          {
            "ubigeo": "180209",
            "nombre": "Quinistaquillas"
          },
          {
            "ubigeo": "180210",
            "nombre": "Ubinas"
          },
          {
            "ubigeo": "180211",
            "nombre": "Yunga"
          }
        ]
      },
      {
        "codigo": "1803",
        "nombre": "Ilo",
        "distritos": [
          {
            "ubigeo": "180301",
            "nombre": "Ilo"
          },
          {
            "ubigeo": "180302",
            "nombre": "El Algarrobal"
          },
          {
            "ubigeo": "180303",
            "nombre": "Pacocha"
          }
        ]
      }
    ]
  },
  {
    "codigo": "19",
    "nombre": "Pasco",
    "provincias": [
      {
        "codigo": "1901",
        "nombre": "Pasco",
        "distritos": [
          {
            "ubigeo": "190101",
            "nombre": "Chaupimarca"
          },
          {
            "ubigeo": "190102",
            "nombre": "Huachon"
          },
          {
            "ubigeo": "190103",
            "nombre": "Huariaca"
          },
          {
            "ubigeo": "190104",
            "nombre": "Huayllay"
          },
          {
            "ubigeo": "190105",
            "nombre": "Ninacaca"
          },
          {
            "ubigeo": "190106",
            "nombre": "Pallanchacra"
          },
          {
            "ubigeo": "190107",
            "nombre": "Paucartambo"
          },
          {
            "ubigeo": "190108",
            "nombre": "San Francisco de Asís de Yarusyacan"
          },
          {
            "ubigeo": "190109",
            "nombre": "Simon Bolivar"
          },
          {
            "ubigeo": "190110",
            "nombre": "Ticlacayan"
          },
          {
            "ubigeo": "190111",
            "nombre": "Tinyahuarco"
          },
          {
            "ubigeo": "190112",
            "nombre": "Vicco"
          },
          {
            "ubigeo": "190113",
            "nombre": "Yanacancha"
          }
        ]
      },
      {
        "codigo": "1902",
        "nombre": "Daniel Alcides Carrión",
        "distritos": [
          {
            "ubigeo": "190201",
            "nombre": "Yanahuanca"
          },
          {
            "ubigeo": "190202",
            "nombre": "Chacayan"
          },
          {
            "ubigeo": "190203",
            "nombre": "Goyllarisquizga"
          },
          {
            "ubigeo": "190204",
            "nombre": "Paucar"
          },
          {
            "ubigeo": "190205",
            "nombre": "San Pedro de Pillao"
          },
          {
            "ubigeo": "190206",
            "nombre": "Santa Ana de Tusi"
          },
          {
            "ubigeo": "190207",
            "nombre": "Tapuc"
          },
          {
            "ubigeo": "190208",
            "nombre": "Vilcabamba"
          }
        ]
      },
      {
        "codigo": "1903",
        "nombre": "Oxapampa",
        "distritos": [
          {
            "ubigeo": "190301",
            "nombre": "Oxapampa"
          },
          {
            "ubigeo": "190302",
            "nombre": "Chontabamba"
          },
          {
            "ubigeo": "190303",
            "nombre": "Huancabamba"
          },
          {
            "ubigeo": "190304",
            "nombre": "Palcazu"
          },
          {
            "ubigeo": "190305",
            "nombre": "Pozuzo"
          },
          {
            "ubigeo": "190306",
            "nombre": "Puerto Bermúdez"
          },
          {
            "ubigeo": "190307",
            "nombre": "Villa Rica"
          },
          {
            "ubigeo": "190308",
            "nombre": "Constitución"
          }
        ]
      }
    ]
  },
  {
    "codigo": "20",
    "nombre": "Piura",
    "provincias": [
      {
        "codigo": "2001",
        "nombre": "Piura",
        "distritos": [
          {
            "ubigeo": "200101",
            "nombre": "Piura"
          },
          {
            "ubigeo": "200104",
            "nombre": "Castilla"
          },
          {
            "ubigeo": "200105",
            "nombre": "Catacaos"
          },
          {
            "ubigeo": "200107",
            "nombre": "Cura Mori"
          },
          {
            "ubigeo": "200108",
            "nombre": "El Tallan"
          },
          {
            "ubigeo": "200109",
            "nombre": "La Arena"
          },
          {
            "ubigeo": "200110",
            "nombre": "La Union"
          },
          {
            "ubigeo": "200111",
            "nombre": "Las Lomas"
          },
          {
            "ubigeo": "200114",
            "nombre": "Tambo Grande"
          },
          {
            "ubigeo": "200115",
            "nombre": "26 de Octubre"
          }
        ]
      },
      {
        "codigo": "2002",
        "nombre": "Ayabaca",
        "distritos": [
          {
            "ubigeo": "200201",
            "nombre": "Ayabaca"
          },
          {
            "ubigeo": "200202",
            "nombre": "Frias"
          },
          {
            "ubigeo": "200203",
            "nombre": "Jilili"
          },
          {
            "ubigeo": "200204",
            "nombre": "Lagunas"
          },
          {
            "ubigeo": "200205",
            "nombre": "Montero"
          },
          {
            "ubigeo": "200206",
            "nombre": "Pacaipampa"
          },
          {
            "ubigeo": "200207",
            "nombre": "Paimas"
          },
          {
            "ubigeo": "200208",
            "nombre": "Sapillica"
          },
          {
            "ubigeo": "200209",
            "nombre": "Sicchez"
          },
          {
            "ubigeo": "200210",
            "nombre": "Suyo"
          }
        ]
      },
      {
        "codigo": "2003",
        "nombre": "Huancabamba",
        "distritos": [
          {
            "ubigeo": "200301",
            "nombre": "Huancabamba"
          },
          {
            "ubigeo": "200302",
            "nombre": "Canchaque"
          },
          {
            "ubigeo": "200303",
            "nombre": "El Carmen de La Frontera"
          },
          {
            "ubigeo": "200304",
            "nombre": "Huarmaca"
          },
          {
            "ubigeo": "200305",
            "nombre": "Lalaquiz"
          },
          {
            "ubigeo": "200306",
            "nombre": "San Miguel de El Faique"
          },
          {
            "ubigeo": "200307",
            "nombre": "Sondor"
          },
          {
            "ubigeo": "200308",
            "nombre": "Sondorillo"
          }
        ]
      },
      {
        "codigo": "2004",
        "nombre": "Morropon",
        "distritos": [
          {
            "ubigeo": "200401",
            "nombre": "Chulucanas"
          },
          {
            "ubigeo": "200402",
            "nombre": "Buenos Aires"
          },
          {
            "ubigeo": "200403",
            "nombre": "Chalaco"
          },
          {
            "ubigeo": "200404",
            "nombre": "La Matanza"
          },
          {
            "ubigeo": "200405",
            "nombre": "Morropon"
          },
          {
            "ubigeo": "200406",
            "nombre": "Salitral"
          },
          {
            "ubigeo": "200407",
            "nombre": "San Juan de Bigote"
          },
          {
            "ubigeo": "200408",
            "nombre": "Santa Catalina de Mossa"
          },
          {
            "ubigeo": "200409",
            "nombre": "Santo Domingo"
          },
          {
            "ubigeo": "200410",
            "nombre": "Yamango"
          }
        ]
      },
      {
        "codigo": "2005",
        "nombre": "Paita",
        "distritos": [
          {
            "ubigeo": "200501",
            "nombre": "Paita"
          },
          {
            "ubigeo": "200502",
            "nombre": "Amotape"
          },
          {
            "ubigeo": "200503",
            "nombre": "Arenal"
          },
          {
            "ubigeo": "200504",
            "nombre": "Colan"
          },
          {
            "ubigeo": "200505",
            "nombre": "La Huaca"
          },
          {
            "ubigeo": "200506",
            "nombre": "Tamarindo"
          },
          {
            "ubigeo": "200507",
            "nombre": "Vichayal"
          }
        ]
      },
      {
        "codigo": "2006",
        "nombre": "Sullana",
        "distritos": [
          {
            "ubigeo": "200601",
            "nombre": "Sullana"
          },
          {
            "ubigeo": "200602",
            "nombre": "Bellavista"
          },
          {
            "ubigeo": "200603",
            "nombre": "Ignacio Escudero"
          },
          {
            "ubigeo": "200604",
            "nombre": "Lancones"
          },
          {
            "ubigeo": "200605",
            "nombre": "Marcavelica"
          },
          {
            "ubigeo": "200606",
            "nombre": "Miguel Checa"
          },
          {
            "ubigeo": "200607",
            "nombre": "Querecotillo"
          },
          {
            "ubigeo": "200608",
            "nombre": "Salitral"
          }
        ]
      },
      {
        "codigo": "2007",
        "nombre": "Talara",
        "distritos": [
          {
            "ubigeo": "200701",
            "nombre": "Pariñas"
          },
          {
            "ubigeo": "200702",
            "nombre": "El Alto"
          },
          {
            "ubigeo": "200703",
            "nombre": "La Brea"
          },
          {
            "ubigeo": "200704",
            "nombre": "Lobitos"
          },
          {
            "ubigeo": "200705",
            "nombre": "Los Organos"
          },
          {
            "ubigeo": "200706",
            "nombre": "Mancora"
          }
        ]
      },
      {
        "codigo": "2008",
        "nombre": "Sechura",
        "distritos": [
          {
            "ubigeo": "200801",
            "nombre": "Sechura"
          },
          {
            "ubigeo": "200802",
            "nombre": "Bellavista de La Union"
          },
          {
            "ubigeo": "200803",
            "nombre": "Bernal"
          },
          {
            "ubigeo": "200804",
            "nombre": "Cristo Nos Valga"
          },
          {
            "ubigeo": "200805",
            "nombre": "Vice"
          },
          {
            "ubigeo": "200806",
            "nombre": "Rinconada Llicuar"
          }
        ]
      }
    ]
  },
  {
    "codigo": "21",
    "nombre": "Puno",
    "provincias": [
      {
        "codigo": "2101",
        "nombre": "Puno",
        "distritos": [
          {
            "ubigeo": "210101",
            "nombre": "Puno"
          },
          {
            "ubigeo": "210102",
            "nombre": "Acora"
          },
          {
            "ubigeo": "210103",
            "nombre": "Amantani"
          },
          {
            "ubigeo": "210104",
            "nombre": "Atuncolla"
          },
          {
            "ubigeo": "210105",
            "nombre": "Capachica"
          },
          {
            "ubigeo": "210106",
            "nombre": "Chucuito"
          },
          {
            "ubigeo": "210107",
            "nombre": "Coata"
          },
          {
            "ubigeo": "210108",
            "nombre": "Huata"
          },
          {
            "ubigeo": "210109",
            "nombre": "Mañazo"
          },
          {
            "ubigeo": "210110",
            "nombre": "Paucarcolla"
          },
          {
            "ubigeo": "210111",
            "nombre": "Pichacani"
          },
          {
            "ubigeo": "210112",
            "nombre": "Plateria"
          },
          {
            "ubigeo": "210113",
            "nombre": "San Antonio"
          },
          {
            "ubigeo": "210114",
            "nombre": "Tiquillaca"
          },
          {
            "ubigeo": "210115",
            "nombre": "Vilque"
          }
        ]
      },
      {
        "codigo": "2102",
        "nombre": "Azángaro",
        "distritos": [
          {
            "ubigeo": "210201",
            "nombre": "Azángaro"
          },
          {
            "ubigeo": "210202",
            "nombre": "Achaya"
          },
          {
            "ubigeo": "210203",
            "nombre": "Arapa"
          },
          {
            "ubigeo": "210204",
            "nombre": "Asillo"
          },
          {
            "ubigeo": "210205",
            "nombre": "Caminaca"
          },
          {
            "ubigeo": "210206",
            "nombre": "Chupa"
          },
          {
            "ubigeo": "210207",
            "nombre": "Jose Domingo Choquehuanca"
          },
          {
            "ubigeo": "210208",
            "nombre": "Muñani"
          },
          {
            "ubigeo": "210209",
            "nombre": "Potoni"
          },
          {
            "ubigeo": "210210",
            "nombre": "Saman"
          },
          {
            "ubigeo": "210211",
            "nombre": "San Anton"
          },
          {
            "ubigeo": "210212",
            "nombre": "San Jose"
          },
          {
            "ubigeo": "210213",
            "nombre": "San Juan de Salinas"
          },
          {
            "ubigeo": "210214",
            "nombre": "Santiago de Pupuja"
          },
          {
            "ubigeo": "210215",
            "nombre": "Tirapata"
          }
        ]
      },
      {
        "codigo": "2103",
        "nombre": "Carabaya",
        "distritos": [
          {
            "ubigeo": "210301",
            "nombre": "Macusani"
          },
          {
            "ubigeo": "210302",
            "nombre": "Ajoyani"
          },
          {
            "ubigeo": "210303",
            "nombre": "Ayapata"
          },
          {
            "ubigeo": "210304",
            "nombre": "Coasa"
          },
          {
            "ubigeo": "210305",
            "nombre": "Corani"
          },
          {
            "ubigeo": "210306",
            "nombre": "Crucero"
          },
          {
            "ubigeo": "210307",
            "nombre": "Ituata"
          },
          {
            "ubigeo": "210308",
            "nombre": "Ollachea"
          },
          {
            "ubigeo": "210309",
            "nombre": "San Gaban"
          },
          {
            "ubigeo": "210310",
            "nombre": "Usicayos"
          }
        ]
      },
      {
        "codigo": "2104",
        "nombre": "Chucuito",
        "distritos": [
          {
            "ubigeo": "210401",
            "nombre": "Juli"
          },
          {
            "ubigeo": "210402",
            "nombre": "Desaguadero"
          },
          {
            "ubigeo": "210403",
            "nombre": "Huacullani"
          },
          {
            "ubigeo": "210404",
            "nombre": "Kelluyo"
          },
          {
            "ubigeo": "210405",
            "nombre": "Pisacoma"
          },
          {
            "ubigeo": "210406",
            "nombre": "Pomata"
          },
          {
            "ubigeo": "210407",
            "nombre": "Zepita"
          }
        ]
      },
      {
        "codigo": "2105",
        "nombre": "El Collao",
        "distritos": [
          {
            "ubigeo": "210501",
            "nombre": "Ilave"
          },
          {
            "ubigeo": "210502",
            "nombre": "Capazo"
          },
          {
            "ubigeo": "210503",
            "nombre": "Pilcuyo"
          },
          {
            "ubigeo": "210504",
            "nombre": "Santa Rosa"
          },
          {
            "ubigeo": "210505",
            "nombre": "Conduriri"
          }
        ]
      },
      {
        "codigo": "2106",
        "nombre": "Huancane",
        "distritos": [
          {
            "ubigeo": "210601",
            "nombre": "Huancane"
          },
          {
            "ubigeo": "210602",
            "nombre": "Cojata"
          },
          {
            "ubigeo": "210603",
            "nombre": "Huatasani"
          },
          {
            "ubigeo": "210604",
            "nombre": "Inchupalla"
          },
          {
            "ubigeo": "210605",
            "nombre": "Pusi"
          },
          {
            "ubigeo": "210606",
            "nombre": "Rosaspata"
          },
          {
            "ubigeo": "210607",
            "nombre": "Taraco"
          },
          {
            "ubigeo": "210608",
            "nombre": "Vilque Chico"
          }
        ]
      },
      {
        "codigo": "2107",
        "nombre": "Lampa",
        "distritos": [
          {
            "ubigeo": "210701",
            "nombre": "Lampa"
          },
          {
            "ubigeo": "210702",
            "nombre": "Cabanilla"
          },
          {
            "ubigeo": "210703",
            "nombre": "Calapuja"
          },
          {
            "ubigeo": "210704",
            "nombre": "Nicasio"
          },
          {
            "ubigeo": "210705",
            "nombre": "Ocuviri"
          },
          {
            "ubigeo": "210706",
            "nombre": "Palca"
          },
          {
            "ubigeo": "210707",
            "nombre": "Paratia"
          },
          {
            "ubigeo": "210708",
            "nombre": "Pucara"
          },
          {
            "ubigeo": "210709",
            "nombre": "Santa Lucia"
          },
          {
            "ubigeo": "210710",
            "nombre": "Vilavila"
          }
        ]
      },
      {
        "codigo": "2108",
        "nombre": "Melgar",
        "distritos": [
          {
            "ubigeo": "210801",
            "nombre": "Ayaviri"
          },
          {
            "ubigeo": "210802",
            "nombre": "Antauta"
          },
          {
            "ubigeo": "210803",
            "nombre": "Cupi"
          },
          {
            "ubigeo": "210804",
            "nombre": "Llalli"
          },
          {
            "ubigeo": "210805",
            "nombre": "Macari"
          },
          {
            "ubigeo": "210806",
            "nombre": "Nuñoa"
          },
          {
            "ubigeo": "210807",
            "nombre": "Orurillo"
          },
          {
            "ubigeo": "210808",
            "nombre": "Santa Rosa"
          },
          {
            "ubigeo": "210809",
            "nombre": "Umachiri"
          }
        ]
      },
      {
        "codigo": "2109",
        "nombre": "Moho",
        "distritos": [
          {
            "ubigeo": "210901",
            "nombre": "Moho"
          },
          {
            "ubigeo": "210902",
            "nombre": "Conima"
          },
          {
            "ubigeo": "210903",
            "nombre": "Huayrapata"
          },
          {
            "ubigeo": "210904",
            "nombre": "Tilali"
          }
        ]
      },
      {
        "codigo": "2110",
        "nombre": "San Antonio de Putina",
        "distritos": [
          {
            "ubigeo": "211001",
            "nombre": "Putina"
          },
          {
            "ubigeo": "211002",
            "nombre": "Ananea"
          },
          {
            "ubigeo": "211003",
            "nombre": "Pedro Vilca Apaza"
          },
          {
            "ubigeo": "211004",
            "nombre": "Quilcapuncu"
          },
          {
            "ubigeo": "211005",
            "nombre": "Sina"
          }
        ]
      },
      {
        "codigo": "2111",
        "nombre": "San Román",
        "distritos": [
          {
            "ubigeo": "211101",
            "nombre": "Juliaca"
          },
          {
            "ubigeo": "211102",
            "nombre": "Cabana"
          },
          {
            "ubigeo": "211103",
            "nombre": "Cabanillas"
          },
          {
            "ubigeo": "211104",
            "nombre": "Caracoto"
          },
          {
            "ubigeo": "211105",
            "nombre": "San Miguel"
          }
        ]
      },
      {
        "codigo": "2112",
        "nombre": "Sandia",
        "distritos": [
          {
            "ubigeo": "211201",
            "nombre": "Sandia"
          },
          {
            "ubigeo": "211202",
            "nombre": "Cuyocuyo"
          },
          {
            "ubigeo": "211203",
            "nombre": "Limbani"
          },
          {
            "ubigeo": "211204",
            "nombre": "Patambuco"
          },
          {
            "ubigeo": "211205",
            "nombre": "Phara"
          },
          {
            "ubigeo": "211206",
            "nombre": "Quiaca"
          },
          {
            "ubigeo": "211207",
            "nombre": "San Juan del Oro"
          },
          {
            "ubigeo": "211208",
            "nombre": "Yanahuaya"
          },
          {
            "ubigeo": "211209",
            "nombre": "Alto Inambari"
          },
          {
            "ubigeo": "211210",
            "nombre": "San Pedro de Putina Punco"
          }
        ]
      },
      {
        "codigo": "2113",
        "nombre": "Yunguyo",
        "distritos": [
          {
            "ubigeo": "211301",
            "nombre": "Yunguyo"
          },
          {
            "ubigeo": "211302",
            "nombre": "Anapia"
          },
          {
            "ubigeo": "211303",
            "nombre": "Copani"
          },
          {
            "ubigeo": "211304",
            "nombre": "Cuturapi"
          },
          {
            "ubigeo": "211305",
            "nombre": "Ollaraya"
          },
          {
            "ubigeo": "211306",
            "nombre": "Tinicachi"
          },
          {
            "ubigeo": "211307",
            "nombre": "Unicachi"
          }
        ]
      }
    ]
  },
  {
    "codigo": "22",
    "nombre": "San Martín",
    "provincias": [
      {
        "codigo": "2201",
        "nombre": "Moyobamba",
        "distritos": [
          {
            "ubigeo": "220101",
            "nombre": "Moyobamba"
          },
          {
            "ubigeo": "220102",
            "nombre": "Calzada"
          },
          {
            "ubigeo": "220103",
            "nombre": "Habana"
          },
          {
            "ubigeo": "220104",
            "nombre": "Jepelacio"
          },
          {
            "ubigeo": "220105",
            "nombre": "Soritor"
          },
          {
            "ubigeo": "220106",
            "nombre": "Yantalo"
          }
        ]
      },
      {
        "codigo": "2202",
        "nombre": "San Martín",
        "distritos": [
          {
            "ubigeo": "220201",
            "nombre": "Bellavista"
          },
          {
            "ubigeo": "220202",
            "nombre": "Alto Biavo"
          },
          {
            "ubigeo": "220203",
            "nombre": "Bajo Biavo"
          },
          {
            "ubigeo": "220204",
            "nombre": "Huallaga"
          },
          {
            "ubigeo": "220205",
            "nombre": "San Pablo"
          },
          {
            "ubigeo": "220206",
            "nombre": "San Rafael"
          }
        ]
      },
      {
        "codigo": "2203",
        "nombre": "El Dorado",
        "distritos": [
          {
            "ubigeo": "220301",
            "nombre": "San Jose de Sisa"
          },
          {
            "ubigeo": "220302",
            "nombre": "Agua Blanca"
          },
          {
            "ubigeo": "220303",
            "nombre": "San Martín"
          },
          {
            "ubigeo": "220304",
            "nombre": "Santa Rosa"
          },
          {
            "ubigeo": "220305",
            "nombre": "Shatoja"
          }
        ]
      },
      {
        "codigo": "2204",
        "nombre": "Huallaga",
        "distritos": [
          {
            "ubigeo": "220401",
            "nombre": "Saposoa"
          },
          {
            "ubigeo": "220402",
            "nombre": "Alto Saposoa"
          },
          {
            "ubigeo": "220403",
            "nombre": "El Eslabón"
          },
          {
            "ubigeo": "220404",
            "nombre": "Piscoyacu"
          },
          {
            "ubigeo": "220405",
            "nombre": "Sacanche"
          },
          {
            "ubigeo": "220406",
            "nombre": "Tingo de Saposoa"
          }
        ]
      },
      {
        "codigo": "2205",
        "nombre": "Lamas",
        "distritos": [
          {
            "ubigeo": "220501",
            "nombre": "Lamas"
          },
          {
            "ubigeo": "220502",
            "nombre": "Alonso de Alvarado"
          },
          {
            "ubigeo": "220503",
            "nombre": "Barranquita"
          },
          {
            "ubigeo": "220504",
            "nombre": "Caynarachi"
          },
          {
            "ubigeo": "220505",
            "nombre": "Cuñumbuqui"
          },
          {
            "ubigeo": "220506",
            "nombre": "Pinto Recodo"
          },
          {
            "ubigeo": "220507",
            "nombre": "Rumisapa"
          },
          {
            "ubigeo": "220508",
            "nombre": "San Roque de Cumbaza"
          },
          {
            "ubigeo": "220509",
            "nombre": "Shanao"
          },
          {
            "ubigeo": "220510",
            "nombre": "Tabalosos"
          },
          {
            "ubigeo": "220511",
            "nombre": "Zapatero"
          }
        ]
      },
      {
        "codigo": "2206",
        "nombre": "Mariscal Cáceres",
        "distritos": [
          {
            "ubigeo": "220601",
            "nombre": "Juanjuí"
          },
          {
            "ubigeo": "220602",
            "nombre": "Campanilla"
          },
          {
            "ubigeo": "220603",
            "nombre": "Huicungo"
          },
          {
            "ubigeo": "220604",
            "nombre": "Pachiza"
          },
          {
            "ubigeo": "220605",
            "nombre": "Pajarillo"
          }
        ]
      },
      {
        "codigo": "2207",
        "nombre": "Picota",
        "distritos": [
          {
            "ubigeo": "220701",
            "nombre": "Picota"
          },
          {
            "ubigeo": "220702",
            "nombre": "Buenos Aires"
          },
          {
            "ubigeo": "220703",
            "nombre": "Caspisapa"
          },
          {
            "ubigeo": "220704",
            "nombre": "Pilluana"
          },
          {
            "ubigeo": "220705",
            "nombre": "Pucacaca"
          },
          {
            "ubigeo": "220706",
            "nombre": "San Cristóbal"
          },
          {
            "ubigeo": "220707",
            "nombre": "San Hilarión"
          },
          {
            "ubigeo": "220708",
            "nombre": "Shamboyacu"
          },
          {
            "ubigeo": "220709",
            "nombre": "Tingo de Ponasa"
          },
          {
            "ubigeo": "220710",
            "nombre": "Tres Unidos"
          }
        ]
      },
      {
        "codigo": "2208",
        "nombre": "Rioja",
        "distritos": [
          {
            "ubigeo": "220801",
            "nombre": "Rioja"
          },
          {
            "ubigeo": "220802",
            "nombre": "Awajun"
          },
          {
            "ubigeo": "220803",
            "nombre": "Elías Soplin Vargas"
          },
          {
            "ubigeo": "220804",
            "nombre": "Nueva Cajamarca"
          },
          {
            "ubigeo": "220805",
            "nombre": "Pardo Miguel"
          },
          {
            "ubigeo": "220806",
            "nombre": "Posic"
          },
          {
            "ubigeo": "220807",
            "nombre": "San Fernando"
          },
          {
            "ubigeo": "220808",
            "nombre": "Yorongos"
          },
          {
            "ubigeo": "220809",
            "nombre": "Yuracyacu"
          }
        ]
      },
      {
        "codigo": "2209",
        "nombre": "San Martín",
        "distritos": [
          {
            "ubigeo": "220901",
            "nombre": "Tarapoto"
          },
          {
            "ubigeo": "220902",
            "nombre": "Alberto Leveau"
          },
          {
            "ubigeo": "220903",
            "nombre": "Cacatachi"
          },
          {
            "ubigeo": "220904",
            "nombre": "Chazuta"
          },
          {
            "ubigeo": "220905",
            "nombre": "Chipurana"
          },
          {
            "ubigeo": "220906",
            "nombre": "El Porvenir"
          },
          {
            "ubigeo": "220907",
            "nombre": "Huimbayoc"
          },
          {
            "ubigeo": "220908",
            "nombre": "Juan Guerra"
          },
          {
            "ubigeo": "220909",
            "nombre": "La Banda de Shilcayo"
          },
          {
            "ubigeo": "220910",
            "nombre": "Morales"
          },
          {
            "ubigeo": "220911",
            "nombre": "Papaplaya"
          },
          {
            "ubigeo": "220912",
            "nombre": "San Antonio"
          },
          {
            "ubigeo": "220913",
            "nombre": "Sauce"
          },
          {
            "ubigeo": "220914",
            "nombre": "Shapaja"
          }
        ]
      },
      {
        "codigo": "2210",
        "nombre": "Tocache",
        "distritos": [
          {
            "ubigeo": "221001",
            "nombre": "Tocache"
          },
          {
            "ubigeo": "221002",
            "nombre": "Nuevo Progreso"
          },
          {
            "ubigeo": "221003",
            "nombre": "Polvora"
          },
          {
            "ubigeo": "221004",
            "nombre": "Shunte"
          },
          {
            "ubigeo": "221005",
            "nombre": "Uchiza"
          }
        ]
      }
    ]
  },
  {
    "codigo": "23",
    "nombre": "Tacna",
    "provincias": [
      {
        "codigo": "2301",
        "nombre": "Tacna",
        "distritos": [
          {
            "ubigeo": "230101",
            "nombre": "Tacna"
          },
          {
            "ubigeo": "230102",
            "nombre": "Alto de La Alianza"
          },
          {
            "ubigeo": "230103",
            "nombre": "Calana"
          },
          {
            "ubigeo": "230104",
            "nombre": "Ciudad Nueva"
          },
          {
            "ubigeo": "230105",
            "nombre": "Inclan"
          },
          {
            "ubigeo": "230106",
            "nombre": "Pachia"
          },
          {
            "ubigeo": "230107",
            "nombre": "Palca"
          },
          {
            "ubigeo": "230108",
            "nombre": "Pocollay"
          },
          {
            "ubigeo": "230109",
            "nombre": "Sama"
          },
          {
            "ubigeo": "230110",
            "nombre": "Coronel Gregorio Albarracín Lanchipa"
          },
          {
            "ubigeo": "230111",
            "nombre": "La Yarada-Los Palos"
          }
        ]
      },
      {
        "codigo": "2302",
        "nombre": "Candarave",
        "distritos": [
          {
            "ubigeo": "230201",
            "nombre": "Candarave"
          },
          {
            "ubigeo": "230202",
            "nombre": "Cairani"
          },
          {
            "ubigeo": "230203",
            "nombre": "Camilaca"
          },
          {
            "ubigeo": "230204",
            "nombre": "Curibaya"
          },
          {
            "ubigeo": "230205",
            "nombre": "Huanuara"
          },
          {
            "ubigeo": "230206",
            "nombre": "Quilahuani"
          }
        ]
      },
      {
        "codigo": "2303",
        "nombre": "Jorge Basadre",
        "distritos": [
          {
            "ubigeo": "230301",
            "nombre": "Locumba"
          },
          {
            "ubigeo": "230302",
            "nombre": "Ilabaya"
          },
          {
            "ubigeo": "230303",
            "nombre": "Ite"
          }
        ]
      },
      {
        "codigo": "2304",
        "nombre": "Tarata",
        "distritos": [
          {
            "ubigeo": "230401",
            "nombre": "Tarata"
          },
          {
            "ubigeo": "230402",
            "nombre": "Héroes Albarracín"
          },
          {
            "ubigeo": "230403",
            "nombre": "Estique"
          },
          {
            "ubigeo": "230404",
            "nombre": "Estique-Pampa"
          },
          {
            "ubigeo": "230405",
            "nombre": "Sitajara"
          },
          {
            "ubigeo": "230406",
            "nombre": "Susapaya"
          },
          {
            "ubigeo": "230407",
            "nombre": "Tarucachi"
          },
          {
            "ubigeo": "230408",
            "nombre": "Ticaco"
          }
        ]
      }
    ]
  },
  {
    "codigo": "24",
    "nombre": "Tumbes",
    "provincias": [
      {
        "codigo": "2401",
        "nombre": "Tumbes",
        "distritos": [
          {
            "ubigeo": "240101",
            "nombre": "Tumbes"
          },
          {
            "ubigeo": "240102",
            "nombre": "Corrales"
          },
          {
            "ubigeo": "240103",
            "nombre": "La Cruz"
          },
          {
            "ubigeo": "240104",
            "nombre": "Pampas de Hospital"
          },
          {
            "ubigeo": "240105",
            "nombre": "San Jacinto"
          },
          {
            "ubigeo": "240106",
            "nombre": "San Juan de La Virgen"
          }
        ]
      },
      {
        "codigo": "2402",
        "nombre": "Contralmirante Villa",
        "distritos": [
          {
            "ubigeo": "240201",
            "nombre": "Zorritos"
          },
          {
            "ubigeo": "240202",
            "nombre": "Casitas"
          },
          {
            "ubigeo": "240203",
            "nombre": "Canoas de Punta Sal"
          }
        ]
      },
      {
        "codigo": "2403",
        "nombre": "Zarumilla",
        "distritos": [
          {
            "ubigeo": "240301",
            "nombre": "Zarumilla"
          },
          {
            "ubigeo": "240302",
            "nombre": "Aguas Verdes"
          },
          {
            "ubigeo": "240303",
            "nombre": "Matapalo"
          },
          {
            "ubigeo": "240304",
            "nombre": "Papayal"
          }
        ]
      }
    ]
  },
  {
    "codigo": "25",
    "nombre": "Ucayali",
    "provincias": [
      {
        "codigo": "2501",
        "nombre": "Coronel Portillo",
        "distritos": [
          {
            "ubigeo": "250101",
            "nombre": "Calleria"
          },
          {
            "ubigeo": "250102",
            "nombre": "Campoverde"
          },
          {
            "ubigeo": "250103",
            "nombre": "Iparia"
          },
          {
            "ubigeo": "250104",
            "nombre": "Masisea"
          },
          {
            "ubigeo": "250105",
            "nombre": "Yarinacocha"
          },
          {
            "ubigeo": "250106",
            "nombre": "Nueva Requena"
          },
          {
            "ubigeo": "250107",
            "nombre": "Manantay"
          }
        ]
      },
      {
        "codigo": "2502",
        "nombre": "Atalaya",
        "distritos": [
          {
            "ubigeo": "250201",
            "nombre": "Raymondi"
          },
          {
            "ubigeo": "250202",
            "nombre": "Sepahua"
          },
          {
            "ubigeo": "250203",
            "nombre": "Tahuania"
          },
          {
            "ubigeo": "250204",
            "nombre": "Yurua"
          }
        ]
      },
      {
        "codigo": "2503",
        "nombre": "Padre Abad",
        "distritos": [
          {
            "ubigeo": "250301",
            "nombre": "Padre Abad"
          },
          {
            "ubigeo": "250302",
            "nombre": "Irazola"
          },
          {
            "ubigeo": "250303",
            "nombre": "Curimana"
          },
          {
            "ubigeo": "250304",
            "nombre": "Neshuya"
          },
          {
            "ubigeo": "250305",
            "nombre": "Alexander Von Humboldt"
          }
        ]
      },
      {
        "codigo": "2504",
        "nombre": "Purús",
        "distritos": [
          {
            "ubigeo": "250401",
            "nombre": "Purús"
          }
        ]
      }
    ]
  },
  {
    "codigo": "01",
    "nombre": "Bagua",
    "provincias": [
      {
        "codigo": "0101",
        "nombre": "Chachapoyas",
        "distritos": [
          {
            "ubigeo": "010101",
            "nombre": "Chachapoyas"
          },
          {
            "ubigeo": "010102",
            "nombre": "Asunción"
          },
          {
            "ubigeo": "010103",
            "nombre": "Balsas"
          },
          {
            "ubigeo": "010104",
            "nombre": "Cheto"
          },
          {
            "ubigeo": "010105",
            "nombre": "Chiliquin"
          },
          {
            "ubigeo": "010106",
            "nombre": "Chuquibamba"
          },
          {
            "ubigeo": "010107",
            "nombre": "Granada"
          },
          {
            "ubigeo": "010108",
            "nombre": "Huancas"
          },
          {
            "ubigeo": "010109",
            "nombre": "La Jalca"
          },
          {
            "ubigeo": "010110",
            "nombre": "Leimebamba"
          },
          {
            "ubigeo": "010111",
            "nombre": "Levanto"
          },
          {
            "ubigeo": "010112",
            "nombre": "Magdalena"
          },
          {
            "ubigeo": "010113",
            "nombre": "Mariscal Castilla"
          },
          {
            "ubigeo": "010114",
            "nombre": "Molinopampa"
          },
          {
            "ubigeo": "010115",
            "nombre": "Montevideo"
          },
          {
            "ubigeo": "010116",
            "nombre": "Olleros"
          },
          {
            "ubigeo": "010117",
            "nombre": "Quinjalca"
          },
          {
            "ubigeo": "010118",
            "nombre": "San Francisco de Daguas"
          },
          {
            "ubigeo": "010119",
            "nombre": "San Isidro de Maino"
          },
          {
            "ubigeo": "010120",
            "nombre": "Soloco"
          },
          {
            "ubigeo": "010121",
            "nombre": "Sonche"
          }
        ]
      },
      {
        "codigo": "0102",
        "nombre": "N/A",
        "distritos": [
          {
            "ubigeo": "010201",
            "nombre": "Bagua"
          },
          {
            "ubigeo": "010202",
            "nombre": "Aramango"
          },
          {
            "ubigeo": "010203",
            "nombre": "Copallin"
          },
          {
            "ubigeo": "010204",
            "nombre": "El Parco"
          },
          {
            "ubigeo": "010205",
            "nombre": "Imaza"
          },
          {
            "ubigeo": "010206",
            "nombre": "La Peca"
          }
        ]
      },
      {
        "codigo": "0103",
        "nombre": "Bongará",
        "distritos": [
          {
            "ubigeo": "010301",
            "nombre": "Jumbilla"
          },
          {
            "ubigeo": "010302",
            "nombre": "Chisquilla"
          },
          {
            "ubigeo": "010303",
            "nombre": "Churuja"
          },
          {
            "ubigeo": "010304",
            "nombre": "Corosha"
          },
          {
            "ubigeo": "010305",
            "nombre": "Cuispes"
          },
          {
            "ubigeo": "010306",
            "nombre": "Florida"
          },
          {
            "ubigeo": "010307",
            "nombre": "Jazan"
          },
          {
            "ubigeo": "010308",
            "nombre": "Recta"
          },
          {
            "ubigeo": "010309",
            "nombre": "San Carlos"
          },
          {
            "ubigeo": "010310",
            "nombre": "Shipasbamba"
          },
          {
            "ubigeo": "010311",
            "nombre": "Valera"
          },
          {
            "ubigeo": "010312",
            "nombre": "Yambrasbamba"
          }
        ]
      },
      {
        "codigo": "0104",
        "nombre": "Condorcanqui",
        "distritos": [
          {
            "ubigeo": "010401",
            "nombre": "Nieva"
          },
          {
            "ubigeo": "010402",
            "nombre": "El Cenepa"
          },
          {
            "ubigeo": "010403",
            "nombre": "Rio Santiago"
          }
        ]
      },
      {
        "codigo": "0105",
        "nombre": "Luya",
        "distritos": [
          {
            "ubigeo": "010501",
            "nombre": "Lamud"
          },
          {
            "ubigeo": "010502",
            "nombre": "Camporredondo"
          },
          {
            "ubigeo": "010503",
            "nombre": "Cocabamba"
          },
          {
            "ubigeo": "010504",
            "nombre": "Colcamar"
          },
          {
            "ubigeo": "010505",
            "nombre": "Conila"
          },
          {
            "ubigeo": "010506",
            "nombre": "Inguilpata"
          },
          {
            "ubigeo": "010507",
            "nombre": "Longuita"
          },
          {
            "ubigeo": "010508",
            "nombre": "Lonya Chico"
          },
          {
            "ubigeo": "010509",
            "nombre": "Luya"
          },
          {
            "ubigeo": "010510",
            "nombre": "Luya Viejo"
          },
          {
            "ubigeo": "010511",
            "nombre": "Maria"
          },
          {
            "ubigeo": "010512",
            "nombre": "Ocalli"
          },
          {
            "ubigeo": "010513",
            "nombre": "Ocumal"
          },
          {
            "ubigeo": "010514",
            "nombre": "Pisuquia"
          },
          {
            "ubigeo": "010515",
            "nombre": "Providencia"
          },
          {
            "ubigeo": "010516",
            "nombre": "San Cristóbal"
          },
          {
            "ubigeo": "010517",
            "nombre": "San Francisco del Yeso"
          },
          {
            "ubigeo": "010518",
            "nombre": "San Jerónimo"
          },
          {
            "ubigeo": "010519",
            "nombre": "San Juan de Lopecancha"
          },
          {
            "ubigeo": "010520",
            "nombre": "Santa Catalina"
          },
          {
            "ubigeo": "010521",
            "nombre": "Santo Tomas"
          },
          {
            "ubigeo": "010522",
            "nombre": "Tingo"
          },
          {
            "ubigeo": "010523",
            "nombre": "Trita"
          }
        ]
      },
      {
        "codigo": "0106",
        "nombre": "Rodríguez de Mendoza",
        "distritos": [
          {
            "ubigeo": "010601",
            "nombre": "San Nicolas"
          },
          {
            "ubigeo": "010602",
            "nombre": "Chirimoto"
          },
          {
            "ubigeo": "010603",
            "nombre": "Cochamal"
          },
          {
            "ubigeo": "010604",
            "nombre": "Huambo"
          },
          {
            "ubigeo": "010605",
            "nombre": "Limabamba"
          },
          {
            "ubigeo": "010606",
            "nombre": "Longar"
          },
          {
            "ubigeo": "010607",
            "nombre": "Mariscal Benavides"
          },
          {
            "ubigeo": "010608",
            "nombre": "Milpuc"
          },
          {
            "ubigeo": "010609",
            "nombre": "Omia"
          },
          {
            "ubigeo": "010610",
            "nombre": "Santa Rosa"
          },
          {
            "ubigeo": "010611",
            "nombre": "Totora"
          },
          {
            "ubigeo": "010612",
            "nombre": "Vista Alegre"
          }
        ]
      },
      {
        "codigo": "0107",
        "nombre": "Utcubamba",
        "distritos": [
          {
            "ubigeo": "010701",
            "nombre": "Bagua Grande"
          },
          {
            "ubigeo": "010702",
            "nombre": "Cajaruro"
          },
          {
            "ubigeo": "010703",
            "nombre": "Cumba"
          },
          {
            "ubigeo": "010704",
            "nombre": "El Milagro"
          },
          {
            "ubigeo": "010705",
            "nombre": "Jamalca"
          },
          {
            "ubigeo": "010706",
            "nombre": "Lonya Grande"
          },
          {
            "ubigeo": "010707",
            "nombre": "Yamon"
          }
        ]
      }
    ]
  },
  {
    "codigo": "02",
    "nombre": "Áncash",
    "provincias": [
      {
        "codigo": "0201",
        "nombre": "Huaraz",
        "distritos": [
          {
            "ubigeo": "020101",
            "nombre": "Huaraz"
          },
          {
            "ubigeo": "020102",
            "nombre": "Cochabamba"
          },
          {
            "ubigeo": "020103",
            "nombre": "Colcabamba"
          },
          {
            "ubigeo": "020104",
            "nombre": "Huanchay"
          },
          {
            "ubigeo": "020105",
            "nombre": "Independencia"
          },
          {
            "ubigeo": "020106",
            "nombre": "Jangas"
          },
          {
            "ubigeo": "020107",
            "nombre": "La Libertad"
          },
          {
            "ubigeo": "020108",
            "nombre": "Olleros"
          },
          {
            "ubigeo": "020109",
            "nombre": "Pampas"
          },
          {
            "ubigeo": "020110",
            "nombre": "Pariacoto"
          },
          {
            "ubigeo": "020111",
            "nombre": "Pira"
          },
          {
            "ubigeo": "020112",
            "nombre": "Tarica"
          }
        ]
      },
      {
        "codigo": "0202",
        "nombre": "Aija",
        "distritos": [
          {
            "ubigeo": "020201",
            "nombre": "Aija"
          },
          {
            "ubigeo": "020202",
            "nombre": "Coris"
          },
          {
            "ubigeo": "020203",
            "nombre": "Huacllan"
          },
          {
            "ubigeo": "020204",
            "nombre": "La Merced"
          },
          {
            "ubigeo": "020205",
            "nombre": "Succha"
          }
        ]
      },
      {
        "codigo": "0203",
        "nombre": "Antonio Raymondi",
        "distritos": [
          {
            "ubigeo": "020301",
            "nombre": "Llamellin"
          },
          {
            "ubigeo": "020302",
            "nombre": "Aczo"
          },
          {
            "ubigeo": "020303",
            "nombre": "Chaccho"
          },
          {
            "ubigeo": "020304",
            "nombre": "Chingas"
          },
          {
            "ubigeo": "020305",
            "nombre": "Mirgas"
          },
          {
            "ubigeo": "020306",
            "nombre": "San Juan de Rontoy"
          }
        ]
      },
      {
        "codigo": "0204",
        "nombre": "Asunción",
        "distritos": [
          {
            "ubigeo": "020401",
            "nombre": "Chacas"
          },
          {
            "ubigeo": "020402",
            "nombre": "Acochaca"
          }
        ]
      },
      {
        "codigo": "0205",
        "nombre": "Bolognesi",
        "distritos": [
          {
            "ubigeo": "020501",
            "nombre": "Chiquian"
          },
          {
            "ubigeo": "020502",
            "nombre": "Abelardo Pardo Lezameta"
          },
          {
            "ubigeo": "020503",
            "nombre": "Antonio Raymondi"
          },
          {
            "ubigeo": "020504",
            "nombre": "Aquia"
          },
          {
            "ubigeo": "020505",
            "nombre": "Cajacay"
          },
          {
            "ubigeo": "020506",
            "nombre": "Canis"
          },
          {
            "ubigeo": "020507",
            "nombre": "Colquioc"
          },
          {
            "ubigeo": "020508",
            "nombre": "Huallanca"
          },
          {
            "ubigeo": "020509",
            "nombre": "Huasta"
          },
          {
            "ubigeo": "020510",
            "nombre": "Huayllacayan"
          },
          {
            "ubigeo": "020511",
            "nombre": "La Primavera"
          },
          {
            "ubigeo": "020512",
            "nombre": "Mangas"
          },
          {
            "ubigeo": "020513",
            "nombre": "Pacllon"
          },
          {
            "ubigeo": "020514",
            "nombre": "San Miguel de Corpanqui"
          },
          {
            "ubigeo": "020515",
            "nombre": "Ticllos"
          }
        ]
      },
      {
        "codigo": "0206",
        "nombre": "Carhuaz",
        "distritos": [
          {
            "ubigeo": "020601",
            "nombre": "Carhuaz"
          },
          {
            "ubigeo": "020602",
            "nombre": "Acopampa"
          },
          {
            "ubigeo": "020603",
            "nombre": "Amashca"
          },
          {
            "ubigeo": "020604",
            "nombre": "Anta"
          },
          {
            "ubigeo": "020605",
            "nombre": "Ataquero"
          },
          {
            "ubigeo": "020606",
            "nombre": "Marcara"
          },
          {
            "ubigeo": "020607",
            "nombre": "Pariahuanca"
          },
          {
            "ubigeo": "020608",
            "nombre": "San Miguel de Aco"
          },
          {
            "ubigeo": "020609",
            "nombre": "Shilla"
          },
          {
            "ubigeo": "020610",
            "nombre": "Tinco"
          },
          {
            "ubigeo": "020611",
            "nombre": "Yungar"
          }
        ]
      },
      {
        "codigo": "0207",
        "nombre": "Carlos Fermín Fitzcarral",
        "distritos": [
          {
            "ubigeo": "020701",
            "nombre": "San Luis"
          },
          {
            "ubigeo": "020702",
            "nombre": "San Nicolas"
          },
          {
            "ubigeo": "020703",
            "nombre": "Yauya"
          }
        ]
      },
      {
        "codigo": "0208",
        "nombre": "Casma",
        "distritos": [
          {
            "ubigeo": "020801",
            "nombre": "Casma"
          },
          {
            "ubigeo": "020802",
            "nombre": "Buena Vista Alta"
          },
          {
            "ubigeo": "020803",
            "nombre": "Comandante Noel"
          },
          {
            "ubigeo": "020804",
            "nombre": "Yautan"
          }
        ]
      },
      {
        "codigo": "0209",
        "nombre": "Corongo",
        "distritos": [
          {
            "ubigeo": "020901",
            "nombre": "Corongo"
          },
          {
            "ubigeo": "020902",
            "nombre": "Aco"
          },
          {
            "ubigeo": "020903",
            "nombre": "Bambas"
          },
          {
            "ubigeo": "020904",
            "nombre": "Cusca"
          },
          {
            "ubigeo": "020905",
            "nombre": "La Pampa"
          },
          {
            "ubigeo": "020906",
            "nombre": "Yanac"
          },
          {
            "ubigeo": "020907",
            "nombre": "Yupan"
          }
        ]
      },
      {
        "codigo": "0210",
        "nombre": "Huari",
        "distritos": [
          {
            "ubigeo": "021001",
            "nombre": "Huari"
          },
          {
            "ubigeo": "021002",
            "nombre": "Anra"
          },
          {
            "ubigeo": "021003",
            "nombre": "Cajay"
          },
          {
            "ubigeo": "021004",
            "nombre": "Chavin de Huantar"
          },
          {
            "ubigeo": "021005",
            "nombre": "Huacachi"
          },
          {
            "ubigeo": "021006",
            "nombre": "Huacchis"
          },
          {
            "ubigeo": "021007",
            "nombre": "Huachis"
          },
          {
            "ubigeo": "021008",
            "nombre": "Huantar"
          },
          {
            "ubigeo": "021009",
            "nombre": "Masin"
          },
          {
            "ubigeo": "021010",
            "nombre": "Paucas"
          },
          {
            "ubigeo": "021011",
            "nombre": "Ponto"
          },
          {
            "ubigeo": "021012",
            "nombre": "Rahuapampa"
          },
          {
            "ubigeo": "021013",
            "nombre": "Rapayan"
          },
          {
            "ubigeo": "021014",
            "nombre": "San Marcos"
          },
          {
            "ubigeo": "021015",
            "nombre": "San Pedro de Chana"
          },
          {
            "ubigeo": "021016",
            "nombre": "Uco"
          }
        ]
      },
      {
        "codigo": "0211",
        "nombre": "Huarmey",
        "distritos": [
          {
            "ubigeo": "021101",
            "nombre": "Huarmey"
          },
          {
            "ubigeo": "021102",
            "nombre": "Cochapeti"
          },
          {
            "ubigeo": "021103",
            "nombre": "Culebras"
          },
          {
            "ubigeo": "021104",
            "nombre": "Huayan"
          },
          {
            "ubigeo": "021105",
            "nombre": "Malvas"
          }
        ]
      },
      {
        "codigo": "0212",
        "nombre": "Huaylas",
        "distritos": [
          {
            "ubigeo": "021201",
            "nombre": "Caraz"
          },
          {
            "ubigeo": "021202",
            "nombre": "Huallanca"
          },
          {
            "ubigeo": "021203",
            "nombre": "Huata"
          },
          {
            "ubigeo": "021204",
            "nombre": "Huaylas"
          },
          {
            "ubigeo": "021205",
            "nombre": "Mato"
          },
          {
            "ubigeo": "021206",
            "nombre": "Pamparomas"
          },
          {
            "ubigeo": "021207",
            "nombre": "Pueblo Libre"
          },
          {
            "ubigeo": "021208",
            "nombre": "Santa Cruz"
          },
          {
            "ubigeo": "021209",
            "nombre": "Santo Toribio"
          },
          {
            "ubigeo": "021210",
            "nombre": "Yuracmarca"
          }
        ]
      },
      {
        "codigo": "0213",
        "nombre": "Mariscal Luzuriaga",
        "distritos": [
          {
            "ubigeo": "021301",
            "nombre": "Piscobamba"
          },
          {
            "ubigeo": "021302",
            "nombre": "Casca"
          },
          {
            "ubigeo": "021303",
            "nombre": "Eleazar Guzmán Barron"
          },
          {
            "ubigeo": "021304",
            "nombre": "Fidel Olivas Escudero"
          },
          {
            "ubigeo": "021305",
            "nombre": "Llama"
          },
          {
            "ubigeo": "021306",
            "nombre": "Llumpa"
          },
          {
            "ubigeo": "021307",
            "nombre": "Lucma"
          },
          {
            "ubigeo": "021308",
            "nombre": "Musga"
          }
        ]
      },
      {
        "codigo": "0214",
        "nombre": "Ocros",
        "distritos": [
          {
            "ubigeo": "021401",
            "nombre": "Ocros"
          },
          {
            "ubigeo": "021402",
            "nombre": "Acas"
          },
          {
            "ubigeo": "021403",
            "nombre": "Cajamarquilla"
          },
          {
            "ubigeo": "021404",
            "nombre": "Carhuapampa"
          },
          {
            "ubigeo": "021405",
            "nombre": "Cochas"
          },
          {
            "ubigeo": "021406",
            "nombre": "Congas"
          },
          {
            "ubigeo": "021407",
            "nombre": "Llipa"
          },
          {
            "ubigeo": "021408",
            "nombre": "San Cristóbal de Rajan"
          },
          {
            "ubigeo": "021409",
            "nombre": "San Pedro"
          },
          {
            "ubigeo": "021410",
            "nombre": "Santiago de Chilcas"
          }
        ]
      },
      {
        "codigo": "0215",
        "nombre": "Pallasca",
        "distritos": [
          {
            "ubigeo": "021501",
            "nombre": "Cabana"
          },
          {
            "ubigeo": "021502",
            "nombre": "Bolognesi"
          },
          {
            "ubigeo": "021503",
            "nombre": "Conchucos"
          },
          {
            "ubigeo": "021504",
            "nombre": "Huacaschuque"
          },
          {
            "ubigeo": "021505",
            "nombre": "Huandoval"
          },
          {
            "ubigeo": "021506",
            "nombre": "Lacabamba"
          },
          {
            "ubigeo": "021507",
            "nombre": "Llapo"
          },
          {
            "ubigeo": "021508",
            "nombre": "Pallasca"
          },
          {
            "ubigeo": "021509",
            "nombre": "Pampas"
          },
          {
            "ubigeo": "021510",
            "nombre": "Santa Rosa"
          },
          {
            "ubigeo": "021511",
            "nombre": "Tauca"
          }
        ]
      },
      {
        "codigo": "0216",
        "nombre": "Pomabamba",
        "distritos": [
          {
            "ubigeo": "021601",
            "nombre": "Pomabamba"
          },
          {
            "ubigeo": "021602",
            "nombre": "Huayllan"
          },
          {
            "ubigeo": "021603",
            "nombre": "Parobamba"
          },
          {
            "ubigeo": "021604",
            "nombre": "Quinuabamba"
          }
        ]
      },
      {
        "codigo": "0217",
        "nombre": "Recuay",
        "distritos": [
          {
            "ubigeo": "021701",
            "nombre": "Recuay"
          },
          {
            "ubigeo": "021702",
            "nombre": "Catac"
          },
          {
            "ubigeo": "021703",
            "nombre": "Cotaparaco"
          },
          {
            "ubigeo": "021704",
            "nombre": "Huayllapampa"
          },
          {
            "ubigeo": "021705",
            "nombre": "Llacllin"
          },
          {
            "ubigeo": "021706",
            "nombre": "Marca"
          },
          {
            "ubigeo": "021707",
            "nombre": "Pampas Chico"
          },
          {
            "ubigeo": "021708",
            "nombre": "Pararin"
          },
          {
            "ubigeo": "021709",
            "nombre": "Tapacocha"
          },
          {
            "ubigeo": "021710",
            "nombre": "Ticapampa"
          }
        ]
      },
      {
        "codigo": "0218",
        "nombre": "Santa",
        "distritos": [
          {
            "ubigeo": "021801",
            "nombre": "Chimbote"
          },
          {
            "ubigeo": "021802",
            "nombre": "Cáceres del Perú"
          },
          {
            "ubigeo": "021803",
            "nombre": "Coishco"
          },
          {
            "ubigeo": "021804",
            "nombre": "Macate"
          },
          {
            "ubigeo": "021805",
            "nombre": "Moro"
          },
          {
            "ubigeo": "021806",
            "nombre": "Nepeña"
          },
          {
            "ubigeo": "021807",
            "nombre": "Samanco"
          },
          {
            "ubigeo": "021808",
            "nombre": "Santa"
          },
          {
            "ubigeo": "021809",
            "nombre": "Nuevo Chimbote"
          }
        ]
      },
      {
        "codigo": "0219",
        "nombre": "Sihuas",
        "distritos": [
          {
            "ubigeo": "021901",
            "nombre": "Sihuas"
          },
          {
            "ubigeo": "021902",
            "nombre": "Acobamba"
          },
          {
            "ubigeo": "021903",
            "nombre": "Alfonso Ugarte"
          },
          {
            "ubigeo": "021904",
            "nombre": "Cashapampa"
          },
          {
            "ubigeo": "021905",
            "nombre": "Chingalpo"
          },
          {
            "ubigeo": "021906",
            "nombre": "Huayllabamba"
          },
          {
            "ubigeo": "021907",
            "nombre": "Quiches"
          },
          {
            "ubigeo": "021908",
            "nombre": "Ragash"
          },
          {
            "ubigeo": "021909",
            "nombre": "San Juan"
          },
          {
            "ubigeo": "021910",
            "nombre": "Sicsibamba"
          }
        ]
      },
      {
        "codigo": "0220",
        "nombre": "Yungay",
        "distritos": [
          {
            "ubigeo": "022001",
            "nombre": "Yungay"
          },
          {
            "ubigeo": "022002",
            "nombre": "Cascapara"
          },
          {
            "ubigeo": "022003",
            "nombre": "Mancos"
          },
          {
            "ubigeo": "022004",
            "nombre": "Matacoto"
          },
          {
            "ubigeo": "022005",
            "nombre": "Quillo"
          },
          {
            "ubigeo": "022006",
            "nombre": "Ranrahirca"
          },
          {
            "ubigeo": "022007",
            "nombre": "Shupluy"
          },
          {
            "ubigeo": "022008",
            "nombre": "Yanama"
          }
        ]
      }
    ]
  },
  {
    "codigo": "03",
    "nombre": "Apurímac",
    "provincias": [
      {
        "codigo": "0301",
        "nombre": "Abancay",
        "distritos": [
          {
            "ubigeo": "030101",
            "nombre": "Abancay"
          },
          {
            "ubigeo": "030102",
            "nombre": "Chacoche"
          },
          {
            "ubigeo": "030103",
            "nombre": "Circa"
          },
          {
            "ubigeo": "030104",
            "nombre": "Curahuasi"
          },
          {
            "ubigeo": "030105",
            "nombre": "Huanipaca"
          },
          {
            "ubigeo": "030106",
            "nombre": "Lambrama"
          },
          {
            "ubigeo": "030107",
            "nombre": "Pichirhua"
          },
          {
            "ubigeo": "030108",
            "nombre": "San Pedro de Cachora"
          },
          {
            "ubigeo": "030109",
            "nombre": "Tamburco"
          }
        ]
      },
      {
        "codigo": "0302",
        "nombre": "Andahuaylas",
        "distritos": [
          {
            "ubigeo": "030201",
            "nombre": "Andahuaylas"
          },
          {
            "ubigeo": "030202",
            "nombre": "Andarapa"
          },
          {
            "ubigeo": "030203",
            "nombre": "Chiara"
          },
          {
            "ubigeo": "030204",
            "nombre": "Huancarama"
          },
          {
            "ubigeo": "030205",
            "nombre": "Huancaray"
          },
          {
            "ubigeo": "030206",
            "nombre": "Huayana"
          },
          {
            "ubigeo": "030207",
            "nombre": "Kishuara"
          },
          {
            "ubigeo": "030208",
            "nombre": "Pacobamba"
          },
          {
            "ubigeo": "030209",
            "nombre": "Pacucha"
          },
          {
            "ubigeo": "030210",
            "nombre": "Pampachiri"
          },
          {
            "ubigeo": "030211",
            "nombre": "Pomacocha"
          },
          {
            "ubigeo": "030212",
            "nombre": "San Antonio de Cachi"
          },
          {
            "ubigeo": "030213",
            "nombre": "San Jerónimo"
          },
          {
            "ubigeo": "030214",
            "nombre": "San Miguel de Chaccrampa"
          },
          {
            "ubigeo": "030215",
            "nombre": "Santa Maria de Chicmo"
          },
          {
            "ubigeo": "030216",
            "nombre": "Talavera"
          },
          {
            "ubigeo": "030217",
            "nombre": "Tumay Huaraca"
          },
          {
            "ubigeo": "030218",
            "nombre": "Turpo"
          },
          {
            "ubigeo": "030219",
            "nombre": "Kaquiabamba"
          },
          {
            "ubigeo": "030220",
            "nombre": "José María Arguedas"
          }
        ]
      },
      {
        "codigo": "0303",
        "nombre": "Antabamba",
        "distritos": [
          {
            "ubigeo": "030301",
            "nombre": "Antabamba"
          },
          {
            "ubigeo": "030302",
            "nombre": "El Oro"
          },
          {
            "ubigeo": "030303",
            "nombre": "Huaquirca"
          },
          {
            "ubigeo": "030304",
            "nombre": "Juan Espinoza Medrano"
          },
          {
            "ubigeo": "030305",
            "nombre": "Oropesa"
          },
          {
            "ubigeo": "030306",
            "nombre": "Pachaconas"
          },
          {
            "ubigeo": "030307",
            "nombre": "Sabaino"
          }
        ]
      },
      {
        "codigo": "0304",
        "nombre": "Aymaraes",
        "distritos": [
          {
            "ubigeo": "030401",
            "nombre": "Chalhuanca"
          },
          {
            "ubigeo": "030402",
            "nombre": "Capaya"
          },
          {
            "ubigeo": "030403",
            "nombre": "Caraybamba"
          },
          {
            "ubigeo": "030404",
            "nombre": "Chapimarca"
          },
          {
            "ubigeo": "030405",
            "nombre": "Colcabamba"
          },
          {
            "ubigeo": "030406",
            "nombre": "Cotaruse"
          },
          {
            "ubigeo": "030407",
            "nombre": "Huayllo"
          },
          {
            "ubigeo": "030408",
            "nombre": "Justo Apu Sahuaraura"
          },
          {
            "ubigeo": "030409",
            "nombre": "Lucre"
          },
          {
            "ubigeo": "030410",
            "nombre": "Pocohuanca"
          },
          {
            "ubigeo": "030411",
            "nombre": "San Juan de Chacña"
          },
          {
            "ubigeo": "030412",
            "nombre": "Sañayca"
          },
          {
            "ubigeo": "030413",
            "nombre": "Soraya"
          },
          {
            "ubigeo": "030414",
            "nombre": "Tapairihua"
          },
          {
            "ubigeo": "030415",
            "nombre": "Tintay"
          },
          {
            "ubigeo": "030416",
            "nombre": "Toraya"
          },
          {
            "ubigeo": "030417",
            "nombre": "Yanaca"
          }
        ]
      },
      {
        "codigo": "0305",
        "nombre": "Cotabambas",
        "distritos": [
          {
            "ubigeo": "030501",
            "nombre": "Tambobamba"
          },
          {
            "ubigeo": "030502",
            "nombre": "Cotabambas"
          },
          {
            "ubigeo": "030503",
            "nombre": "Coyllurqui"
          },
          {
            "ubigeo": "030504",
            "nombre": "Haquira"
          },
          {
            "ubigeo": "030505",
            "nombre": "Mara"
          },
          {
            "ubigeo": "030506",
            "nombre": "Challhuahuacho"
          }
        ]
      },
      {
        "codigo": "0306",
        "nombre": "Chincheros",
        "distritos": [
          {
            "ubigeo": "030601",
            "nombre": "Chincheros"
          },
          {
            "ubigeo": "030602",
            "nombre": "Anco Huallo"
          },
          {
            "ubigeo": "030603",
            "nombre": "Cocharcas"
          },
          {
            "ubigeo": "030604",
            "nombre": "Huaccana"
          },
          {
            "ubigeo": "030605",
            "nombre": "Ocobamba"
          },
          {
            "ubigeo": "030606",
            "nombre": "Ongoy"
          },
          {
            "ubigeo": "030607",
            "nombre": "Uranmarca"
          },
          {
            "ubigeo": "030608",
            "nombre": "Ranracancha"
          },
          {
            "ubigeo": "030609",
            "nombre": "Rocchacc"
          },
          {
            "ubigeo": "030610",
            "nombre": "El Porvenir"
          },
          {
            "ubigeo": "030611",
            "nombre": "Los Chankas"
          }
        ]
      },
      {
        "codigo": "0307",
        "nombre": "Grau",
        "distritos": [
          {
            "ubigeo": "030701",
            "nombre": "Chuquibambilla"
          },
          {
            "ubigeo": "030702",
            "nombre": "Curpahuasi"
          },
          {
            "ubigeo": "030703",
            "nombre": "Gamarra"
          },
          {
            "ubigeo": "030704",
            "nombre": "Huayllati"
          },
          {
            "ubigeo": "030705",
            "nombre": "Mamara"
          },
          {
            "ubigeo": "030706",
            "nombre": "Micaela Bastidas"
          },
          {
            "ubigeo": "030707",
            "nombre": "Pataypampa"
          },
          {
            "ubigeo": "030708",
            "nombre": "Progreso"
          },
          {
            "ubigeo": "030709",
            "nombre": "San Antonio"
          },
          {
            "ubigeo": "030710",
            "nombre": "Santa Rosa"
          },
          {
            "ubigeo": "030711",
            "nombre": "Turpay"
          },
          {
            "ubigeo": "030712",
            "nombre": "Vilcabamba"
          },
          {
            "ubigeo": "030713",
            "nombre": "Virundo"
          },
          {
            "ubigeo": "030714",
            "nombre": "Curasco"
          }
        ]
      }
    ]
  },
  {
    "codigo": "04",
    "nombre": "Arequipa",
    "provincias": [
      {
        "codigo": "0401",
        "nombre": "Arequipa",
        "distritos": [
          {
            "ubigeo": "040101",
            "nombre": "Arequipa"
          },
          {
            "ubigeo": "040102",
            "nombre": "Alto Selva Alegre"
          },
          {
            "ubigeo": "040103",
            "nombre": "Cayma"
          },
          {
            "ubigeo": "040104",
            "nombre": "Cerro Colorado"
          },
          {
            "ubigeo": "040105",
            "nombre": "Characato"
          },
          {
            "ubigeo": "040106",
            "nombre": "Chiguata"
          },
          {
            "ubigeo": "040107",
            "nombre": "Jacobo Hunter"
          },
          {
            "ubigeo": "040108",
            "nombre": "La Joya"
          },
          {
            "ubigeo": "040109",
            "nombre": "Mariano Melgar"
          },
          {
            "ubigeo": "040110",
            "nombre": "Miraflores"
          },
          {
            "ubigeo": "040111",
            "nombre": "Mollebaya"
          },
          {
            "ubigeo": "040112",
            "nombre": "Paucarpata"
          },
          {
            "ubigeo": "040113",
            "nombre": "Pocsi"
          },
          {
            "ubigeo": "040114",
            "nombre": "Polobaya"
          },
          {
            "ubigeo": "040115",
            "nombre": "Quequeña"
          },
          {
            "ubigeo": "040116",
            "nombre": "Sabandia"
          },
          {
            "ubigeo": "040117",
            "nombre": "Sachaca"
          },
          {
            "ubigeo": "040118",
            "nombre": "San Juan de Siguas"
          },
          {
            "ubigeo": "040119",
            "nombre": "San Juan de Tarucani"
          },
          {
            "ubigeo": "040120",
            "nombre": "Santa Isabel de Siguas"
          },
          {
            "ubigeo": "040121",
            "nombre": "Santa Rita de Siguas"
          },
          {
            "ubigeo": "040122",
            "nombre": "Socabaya"
          },
          {
            "ubigeo": "040123",
            "nombre": "Tiabaya"
          },
          {
            "ubigeo": "040124",
            "nombre": "Uchumayo"
          },
          {
            "ubigeo": "040125",
            "nombre": "Vitor"
          },
          {
            "ubigeo": "040126",
            "nombre": "Yanahuara"
          },
          {
            "ubigeo": "040127",
            "nombre": "Yarabamba"
          },
          {
            "ubigeo": "040128",
            "nombre": "Yura"
          },
          {
            "ubigeo": "040129",
            "nombre": "Jose Luis Bustamante y Rivero"
          }
        ]
      },
      {
        "codigo": "0402",
        "nombre": "Camaná",
        "distritos": [
          {
            "ubigeo": "040201",
            "nombre": "Camaná"
          },
          {
            "ubigeo": "040202",
            "nombre": "Jose Maria Quimper"
          },
          {
            "ubigeo": "040203",
            "nombre": "Mariano Nicolas Valcárcel"
          },
          {
            "ubigeo": "040204",
            "nombre": "Mariscal Cáceres"
          },
          {
            "ubigeo": "040205",
            "nombre": "Nicolas de Pierola"
          },
          {
            "ubigeo": "040206",
            "nombre": "Ocoña"
          },
          {
            "ubigeo": "040207",
            "nombre": "Quilca"
          },
          {
            "ubigeo": "040208",
            "nombre": "Samuel Pastor"
          }
        ]
      },
      {
        "codigo": "0403",
        "nombre": "Caravelí",
        "distritos": [
          {
            "ubigeo": "040301",
            "nombre": "Caravelí"
          },
          {
            "ubigeo": "040302",
            "nombre": "Acarí"
          },
          {
            "ubigeo": "040303",
            "nombre": "Atico"
          },
          {
            "ubigeo": "040304",
            "nombre": "Atiquipa"
          },
          {
            "ubigeo": "040305",
            "nombre": "Bella Union"
          },
          {
            "ubigeo": "040306",
            "nombre": "Cahuacho"
          },
          {
            "ubigeo": "040307",
            "nombre": "Chala"
          },
          {
            "ubigeo": "040308",
            "nombre": "Chaparra"
          },
          {
            "ubigeo": "040309",
            "nombre": "Huanuhuanu"
          },
          {
            "ubigeo": "040310",
            "nombre": "Jaqui"
          },
          {
            "ubigeo": "040311",
            "nombre": "Lomas"
          },
          {
            "ubigeo": "040312",
            "nombre": "Quicacha"
          },
          {
            "ubigeo": "040313",
            "nombre": "Yauca"
          }
        ]
      },
      {
        "codigo": "0404",
        "nombre": "Castilla",
        "distritos": [
          {
            "ubigeo": "040401",
            "nombre": "Aplao"
          },
          {
            "ubigeo": "040402",
            "nombre": "Andagua"
          },
          {
            "ubigeo": "040403",
            "nombre": "Ayo"
          },
          {
            "ubigeo": "040404",
            "nombre": "Chachas"
          },
          {
            "ubigeo": "040405",
            "nombre": "Chilcaymarca"
          },
          {
            "ubigeo": "040406",
            "nombre": "Choco"
          },
          {
            "ubigeo": "040407",
            "nombre": "Huancarqui"
          },
          {
            "ubigeo": "040408",
            "nombre": "Machaguay"
          },
          {
            "ubigeo": "040409",
            "nombre": "Orcopampa"
          },
          {
            "ubigeo": "040410",
            "nombre": "Pampacolca"
          },
          {
            "ubigeo": "040411",
            "nombre": "Tipan"
          },
          {
            "ubigeo": "040412",
            "nombre": "Uñon"
          },
          {
            "ubigeo": "040413",
            "nombre": "Uraca"
          },
          {
            "ubigeo": "040414",
            "nombre": "Viraco"
          }
        ]
      },
      {
        "codigo": "0405",
        "nombre": "Caylloma",
        "distritos": [
          {
            "ubigeo": "040501",
            "nombre": "Chivay"
          },
          {
            "ubigeo": "040502",
            "nombre": "Achoma"
          },
          {
            "ubigeo": "040503",
            "nombre": "Cabanaconde"
          },
          {
            "ubigeo": "040504",
            "nombre": "Callalli"
          },
          {
            "ubigeo": "040505",
            "nombre": "Caylloma"
          },
          {
            "ubigeo": "040506",
            "nombre": "Coporaque"
          },
          {
            "ubigeo": "040507",
            "nombre": "Huambo"
          },
          {
            "ubigeo": "040508",
            "nombre": "Huanca"
          },
          {
            "ubigeo": "040509",
            "nombre": "Ichupampa"
          },
          {
            "ubigeo": "040510",
            "nombre": "Lari"
          },
          {
            "ubigeo": "040511",
            "nombre": "Lluta"
          },
          {
            "ubigeo": "040512",
            "nombre": "Maca"
          },
          {
            "ubigeo": "040513",
            "nombre": "Madrigal"
          },
          {
            "ubigeo": "040514",
            "nombre": "San Antonio de Chuca"
          },
          {
            "ubigeo": "040515",
            "nombre": "Sibayo"
          },
          {
            "ubigeo": "040516",
            "nombre": "Tapay"
          },
          {
            "ubigeo": "040517",
            "nombre": "Tisco"
          },
          {
            "ubigeo": "040518",
            "nombre": "Tuti"
          },
          {
            "ubigeo": "040519",
            "nombre": "Yanque"
          },
          {
            "ubigeo": "040520",
            "nombre": "Majes"
          }
        ]
      },
      {
        "codigo": "0406",
        "nombre": "Condesuyos",
        "distritos": [
          {
            "ubigeo": "040601",
            "nombre": "Chuquibamba"
          },
          {
            "ubigeo": "040602",
            "nombre": "Andaray"
          },
          {
            "ubigeo": "040603",
            "nombre": "Cayarani"
          },
          {
            "ubigeo": "040604",
            "nombre": "Chichas"
          },
          {
            "ubigeo": "040605",
            "nombre": "Iray"
          },
          {
            "ubigeo": "040606",
            "nombre": "Rio Grande"
          },
          {
            "ubigeo": "040607",
            "nombre": "Salamanca"
          },
          {
            "ubigeo": "040608",
            "nombre": "Yanaquihua"
          }
        ]
      },
      {
        "codigo": "0407",
        "nombre": "Islay",
        "distritos": [
          {
            "ubigeo": "040701",
            "nombre": "Mollendo"
          },
          {
            "ubigeo": "040702",
            "nombre": "Cocachacra"
          },
          {
            "ubigeo": "040703",
            "nombre": "Dean Valdivia"
          },
          {
            "ubigeo": "040704",
            "nombre": "Islay"
          },
          {
            "ubigeo": "040705",
            "nombre": "Mejia"
          },
          {
            "ubigeo": "040706",
            "nombre": "Punta de Bombón"
          }
        ]
      },
      {
        "codigo": "0408",
        "nombre": "La Union",
        "distritos": [
          {
            "ubigeo": "040801",
            "nombre": "Cotahuasi"
          },
          {
            "ubigeo": "040802",
            "nombre": "Alca"
          },
          {
            "ubigeo": "040803",
            "nombre": "Charcana"
          },
          {
            "ubigeo": "040804",
            "nombre": "Huaynacotas"
          },
          {
            "ubigeo": "040805",
            "nombre": "Pampamarca"
          },
          {
            "ubigeo": "040806",
            "nombre": "Puyca"
          },
          {
            "ubigeo": "040807",
            "nombre": "Quechualla"
          },
          {
            "ubigeo": "040808",
            "nombre": "Sayla"
          },
          {
            "ubigeo": "040809",
            "nombre": "Tauria"
          },
          {
            "ubigeo": "040810",
            "nombre": "Tomepampa"
          },
          {
            "ubigeo": "040811",
            "nombre": "Toro"
          }
        ]
      }
    ]
  },
  {
    "codigo": "05",
    "nombre": "Ayacucho",
    "provincias": [
      {
        "codigo": "0501",
        "nombre": "Huamanga",
        "distritos": [
          {
            "ubigeo": "050101",
            "nombre": "Ayacucho"
          },
          {
            "ubigeo": "050102",
            "nombre": "Acocro"
          },
          {
            "ubigeo": "050103",
            "nombre": "Acos Vinchos"
          },
          {
            "ubigeo": "050104",
            "nombre": "Carmen Alto"
          },
          {
            "ubigeo": "050105",
            "nombre": "Chiara"
          },
          {
            "ubigeo": "050106",
            "nombre": "Ocros"
          },
          {
            "ubigeo": "050107",
            "nombre": "Pacaycasa"
          },
          {
            "ubigeo": "050108",
            "nombre": "Quinua"
          },
          {
            "ubigeo": "050109",
            "nombre": "San Jose de Ticllas"
          },
          {
            "ubigeo": "050110",
            "nombre": "San Juan Bautista"
          },
          {
            "ubigeo": "050111",
            "nombre": "Santiago de Pischa"
          },
          {
            "ubigeo": "050112",
            "nombre": "Socos"
          },
          {
            "ubigeo": "050113",
            "nombre": "Tambillo"
          },
          {
            "ubigeo": "050114",
            "nombre": "Vinchos"
          },
          {
            "ubigeo": "050115",
            "nombre": "Jesus Nazareno"
          },
          {
            "ubigeo": "050116",
            "nombre": "Andrés Avelino Cáceres Dorregaray"
          }
        ]
      },
      {
        "codigo": "0502",
        "nombre": "Cangallo",
        "distritos": [
          {
            "ubigeo": "050201",
            "nombre": "Cangallo"
          },
          {
            "ubigeo": "050202",
            "nombre": "Chuschi"
          },
          {
            "ubigeo": "050203",
            "nombre": "Los Morochucos"
          },
          {
            "ubigeo": "050204",
            "nombre": "Maria Parado de Bellido"
          },
          {
            "ubigeo": "050205",
            "nombre": "Paras"
          },
          {
            "ubigeo": "050206",
            "nombre": "Totos"
          }
        ]
      },
      {
        "codigo": "0503",
        "nombre": "Huanca Sancos",
        "distritos": [
          {
            "ubigeo": "050301",
            "nombre": "Sancos"
          },
          {
            "ubigeo": "050302",
            "nombre": "Carapo"
          },
          {
            "ubigeo": "050303",
            "nombre": "Sacsamarca"
          },
          {
            "ubigeo": "050304",
            "nombre": "Santiago de Lucanamarca"
          }
        ]
      },
      {
        "codigo": "0504",
        "nombre": "Huanta",
        "distritos": [
          {
            "ubigeo": "050401",
            "nombre": "Huanta"
          },
          {
            "ubigeo": "050402",
            "nombre": "Ayahuanco"
          },
          {
            "ubigeo": "050403",
            "nombre": "Huamanguilla"
          },
          {
            "ubigeo": "050404",
            "nombre": "Iguain"
          },
          {
            "ubigeo": "050405",
            "nombre": "Luricocha"
          },
          {
            "ubigeo": "050406",
            "nombre": "Santillana"
          },
          {
            "ubigeo": "050407",
            "nombre": "Sivia"
          },
          {
            "ubigeo": "050408",
            "nombre": "Llochegua"
          },
          {
            "ubigeo": "050409",
            "nombre": "Canayre"
          },
          {
            "ubigeo": "050410",
            "nombre": "Uchuraccay"
          },
          {
            "ubigeo": "050411",
            "nombre": "Pucacolpa"
          },
          {
            "ubigeo": "050412",
            "nombre": "Chaca"
          }
        ]
      },
      {
        "codigo": "0505",
        "nombre": "La Mar",
        "distritos": [
          {
            "ubigeo": "050501",
            "nombre": "San Miguel"
          },
          {
            "ubigeo": "050502",
            "nombre": "Anco"
          },
          {
            "ubigeo": "050503",
            "nombre": "Ayna"
          },
          {
            "ubigeo": "050504",
            "nombre": "Chilcas"
          },
          {
            "ubigeo": "050505",
            "nombre": "Chungui"
          },
          {
            "ubigeo": "050506",
            "nombre": "Luis Carranza"
          },
          {
            "ubigeo": "050507",
            "nombre": "Santa Rosa"
          },
          {
            "ubigeo": "050508",
            "nombre": "Tambo"
          },
          {
            "ubigeo": "050509",
            "nombre": "Samugari"
          },
          {
            "ubigeo": "050510",
            "nombre": "Anchihuay"
          },
          {
            "ubigeo": "050511",
            "nombre": "Oronccoy"
          }
        ]
      },
      {
        "codigo": "0506",
        "nombre": "Lucanas",
        "distritos": [
          {
            "ubigeo": "050601",
            "nombre": "Puquio"
          },
          {
            "ubigeo": "050602",
            "nombre": "Aucara"
          },
          {
            "ubigeo": "050603",
            "nombre": "Cabana"
          },
          {
            "ubigeo": "050604",
            "nombre": "Carmen Salcedo"
          },
          {
            "ubigeo": "050605",
            "nombre": "Chaviña"
          },
          {
            "ubigeo": "050606",
            "nombre": "Chipao"
          },
          {
            "ubigeo": "050607",
            "nombre": "Huac-Huas"
          },
          {
            "ubigeo": "050608",
            "nombre": "Laramate"
          },
          {
            "ubigeo": "050609",
            "nombre": "Leoncio Prado"
          },
          {
            "ubigeo": "050610",
            "nombre": "Llauta"
          },
          {
            "ubigeo": "050611",
            "nombre": "Lucanas"
          },
          {
            "ubigeo": "050612",
            "nombre": "Ocaña"
          },
          {
            "ubigeo": "050613",
            "nombre": "Otoca"
          },
          {
            "ubigeo": "050614",
            "nombre": "Saisa"
          },
          {
            "ubigeo": "050615",
            "nombre": "San Cristóbal"
          },
          {
            "ubigeo": "050616",
            "nombre": "San Juan"
          },
          {
            "ubigeo": "050617",
            "nombre": "San Pedro"
          },
          {
            "ubigeo": "050618",
            "nombre": "San Pedro de Palco"
          },
          {
            "ubigeo": "050619",
            "nombre": "Sancos"
          },
          {
            "ubigeo": "050620",
            "nombre": "Santa Ana de Huaycahuacho"
          },
          {
            "ubigeo": "050621",
            "nombre": "Santa Lucia"
          }
        ]
      },
      {
        "codigo": "0507",
        "nombre": "Parinacochas",
        "distritos": [
          {
            "ubigeo": "050701",
            "nombre": "Coracora"
          },
          {
            "ubigeo": "050702",
            "nombre": "Chumpi"
          },
          {
            "ubigeo": "050703",
            "nombre": "Coronel Castañeda"
          },
          {
            "ubigeo": "050704",
            "nombre": "Pacapausa"
          },
          {
            "ubigeo": "050705",
            "nombre": "Pullo"
          },
          {
            "ubigeo": "050706",
            "nombre": "Puyusca"
          },
          {
            "ubigeo": "050707",
            "nombre": "San Francisco de Ravacayco"
          },
          {
            "ubigeo": "050708",
            "nombre": "Upahuacho"
          }
        ]
      },
      {
        "codigo": "0508",
        "nombre": "Paucar del Sara Sara",
        "distritos": [
          {
            "ubigeo": "050801",
            "nombre": "Pausa"
          },
          {
            "ubigeo": "050802",
            "nombre": "Colta"
          },
          {
            "ubigeo": "050803",
            "nombre": "Corculla"
          },
          {
            "ubigeo": "050804",
            "nombre": "Lampa"
          },
          {
            "ubigeo": "050805",
            "nombre": "Marcabamba"
          },
          {
            "ubigeo": "050806",
            "nombre": "Oyolo"
          },
          {
            "ubigeo": "050807",
            "nombre": "Pararca"
          },
          {
            "ubigeo": "050808",
            "nombre": "San Javier de Alpabamba"
          },
          {
            "ubigeo": "050809",
            "nombre": "San Jose de Ushua"
          },
          {
            "ubigeo": "050810",
            "nombre": "Sara Sara"
          }
        ]
      },
      {
        "codigo": "0509",
        "nombre": "Sucre",
        "distritos": [
          {
            "ubigeo": "050901",
            "nombre": "Querobamba"
          },
          {
            "ubigeo": "050902",
            "nombre": "Belén"
          },
          {
            "ubigeo": "050903",
            "nombre": "Chalcos"
          },
          {
            "ubigeo": "050904",
            "nombre": "Chilcayoc"
          },
          {
            "ubigeo": "050905",
            "nombre": "Huacaña"
          },
          {
            "ubigeo": "050906",
            "nombre": "Morcolla"
          },
          {
            "ubigeo": "050907",
            "nombre": "Paico"
          },
          {
            "ubigeo": "050908",
            "nombre": "San Pedro de Larcay"
          },
          {
            "ubigeo": "050909",
            "nombre": "San Salvador de Quije"
          },
          {
            "ubigeo": "050910",
            "nombre": "Santiago de Paucaray"
          },
          {
            "ubigeo": "050911",
            "nombre": "Soras"
          }
        ]
      },
      {
        "codigo": "0510",
        "nombre": "Victor Fajardo",
        "distritos": [
          {
            "ubigeo": "051001",
            "nombre": "Huancapi"
          },
          {
            "ubigeo": "051002",
            "nombre": "Alcamenca"
          },
          {
            "ubigeo": "051003",
            "nombre": "Apongo"
          },
          {
            "ubigeo": "051004",
            "nombre": "Asquipata"
          },
          {
            "ubigeo": "051005",
            "nombre": "Canaria"
          },
          {
            "ubigeo": "051006",
            "nombre": "Cayara"
          },
          {
            "ubigeo": "051007",
            "nombre": "Colca"
          },
          {
            "ubigeo": "051008",
            "nombre": "Huamanquiquia"
          },
          {
            "ubigeo": "051009",
            "nombre": "Huancaraylla"
          },
          {
            "ubigeo": "051010",
            "nombre": "Huaya"
          },
          {
            "ubigeo": "051011",
            "nombre": "Sarhua"
          },
          {
            "ubigeo": "051012",
            "nombre": "Vilcanchos"
          }
        ]
      },
      {
        "codigo": "0511",
        "nombre": "Vilcas Huaman",
        "distritos": [
          {
            "ubigeo": "051101",
            "nombre": "Vilcas Huaman"
          },
          {
            "ubigeo": "051102",
            "nombre": "Accomarca"
          },
          {
            "ubigeo": "051103",
            "nombre": "Carhuanca"
          },
          {
            "ubigeo": "051104",
            "nombre": "Concepcion"
          },
          {
            "ubigeo": "051105",
            "nombre": "Huambalpa"
          },
          {
            "ubigeo": "051106",
            "nombre": "Independencia"
          },
          {
            "ubigeo": "051107",
            "nombre": "Saurama"
          },
          {
            "ubigeo": "051108",
            "nombre": "Vischongo"
          }
        ]
      }
    ]
  },
  {
    "codigo": "06",
    "nombre": "Cajamarca",
    "provincias": [
      {
        "codigo": "0601",
        "nombre": "Cajamarca",
        "distritos": [
          {
            "ubigeo": "060101",
            "nombre": "Cajamarca"
          },
          {
            "ubigeo": "060102",
            "nombre": "Asunción"
          },
          {
            "ubigeo": "060103",
            "nombre": "Chetilla"
          },
          {
            "ubigeo": "060104",
            "nombre": "Cospan"
          },
          {
            "ubigeo": "060105",
            "nombre": "Encañada"
          },
          {
            "ubigeo": "060106",
            "nombre": "Jesus"
          },
          {
            "ubigeo": "060107",
            "nombre": "Llacanora"
          },
          {
            "ubigeo": "060108",
            "nombre": "Los Baños del Inca"
          },
          {
            "ubigeo": "060109",
            "nombre": "Magdalena"
          },
          {
            "ubigeo": "060110",
            "nombre": "Matara"
          },
          {
            "ubigeo": "060111",
            "nombre": "Namora"
          },
          {
            "ubigeo": "060112",
            "nombre": "San Juan"
          }
        ]
      },
      {
        "codigo": "0602",
        "nombre": "Cajabamba",
        "distritos": [
          {
            "ubigeo": "060201",
            "nombre": "Cajabamba"
          },
          {
            "ubigeo": "060202",
            "nombre": "Cachachi"
          },
          {
            "ubigeo": "060203",
            "nombre": "Condebamba"
          },
          {
            "ubigeo": "060204",
            "nombre": "Sitacocha"
          }
        ]
      },
      {
        "codigo": "0603",
        "nombre": "Celendín",
        "distritos": [
          {
            "ubigeo": "060301",
            "nombre": "Celendín"
          },
          {
            "ubigeo": "060302",
            "nombre": "Chumuch"
          },
          {
            "ubigeo": "060303",
            "nombre": "Cortegana"
          },
          {
            "ubigeo": "060304",
            "nombre": "Huasmin"
          },
          {
            "ubigeo": "060305",
            "nombre": "Jorge Chávez"
          },
          {
            "ubigeo": "060306",
            "nombre": "Jose Gálvez"
          },
          {
            "ubigeo": "060307",
            "nombre": "Miguel Iglesias"
          },
          {
            "ubigeo": "060308",
            "nombre": "Oxamarca"
          },
          {
            "ubigeo": "060309",
            "nombre": "Sorochuco"
          },
          {
            "ubigeo": "060310",
            "nombre": "Sucre"
          },
          {
            "ubigeo": "060311",
            "nombre": "Utco"
          },
          {
            "ubigeo": "060312",
            "nombre": "La Libertad de Pallan"
          }
        ]
      },
      {
        "codigo": "0604",
        "nombre": "Chota",
        "distritos": [
          {
            "ubigeo": "060401",
            "nombre": "Chota"
          },
          {
            "ubigeo": "060402",
            "nombre": "Anguia"
          },
          {
            "ubigeo": "060403",
            "nombre": "Chadin"
          },
          {
            "ubigeo": "060404",
            "nombre": "Chiguirip"
          },
          {
            "ubigeo": "060405",
            "nombre": "Chimban"
          },
          {
            "ubigeo": "060406",
            "nombre": "Choropampa"
          },
          {
            "ubigeo": "060407",
            "nombre": "Cochabamba"
          },
          {
            "ubigeo": "060408",
            "nombre": "Conchan"
          },
          {
            "ubigeo": "060409",
            "nombre": "Huambos"
          },
          {
            "ubigeo": "060410",
            "nombre": "Lajas"
          },
          {
            "ubigeo": "060411",
            "nombre": "Llama"
          },
          {
            "ubigeo": "060412",
            "nombre": "Miracosta"
          },
          {
            "ubigeo": "060413",
            "nombre": "Paccha"
          },
          {
            "ubigeo": "060414",
            "nombre": "Pion"
          },
          {
            "ubigeo": "060415",
            "nombre": "Querocoto"
          },
          {
            "ubigeo": "060416",
            "nombre": "San Juan de Licupis"
          },
          {
            "ubigeo": "060417",
            "nombre": "Tacabamba"
          },
          {
            "ubigeo": "060418",
            "nombre": "Tocmoche"
          },
          {
            "ubigeo": "060419",
            "nombre": "Chalamarca"
          }
        ]
      },
      {
        "codigo": "0605",
        "nombre": "Contumaza",
        "distritos": [
          {
            "ubigeo": "060501",
            "nombre": "Contumaza"
          },
          {
            "ubigeo": "060502",
            "nombre": "Chilete"
          },
          {
            "ubigeo": "060503",
            "nombre": "Cupisnique"
          },
          {
            "ubigeo": "060504",
            "nombre": "Guzmango"
          },
          {
            "ubigeo": "060505",
            "nombre": "San Benito"
          },
          {
            "ubigeo": "060506",
            "nombre": "Santa Cruz de Toled"
          },
          {
            "ubigeo": "060507",
            "nombre": "Tantarica"
          },
          {
            "ubigeo": "060508",
            "nombre": "Yonan"
          }
        ]
      },
      {
        "codigo": "0606",
        "nombre": "Cutervo",
        "distritos": [
          {
            "ubigeo": "060601",
            "nombre": "Cutervo"
          },
          {
            "ubigeo": "060602",
            "nombre": "Callayuc"
          },
          {
            "ubigeo": "060603",
            "nombre": "Choros"
          },
          {
            "ubigeo": "060604",
            "nombre": "Cujillo"
          },
          {
            "ubigeo": "060605",
            "nombre": "La Ramada"
          },
          {
            "ubigeo": "060606",
            "nombre": "Pimpingos"
          },
          {
            "ubigeo": "060607",
            "nombre": "Querocotillo"
          },
          {
            "ubigeo": "060608",
            "nombre": "San Andrés de Cutervo"
          },
          {
            "ubigeo": "060609",
            "nombre": "San Juan de Cutervo"
          },
          {
            "ubigeo": "060610",
            "nombre": "San Luis de Lucma"
          },
          {
            "ubigeo": "060611",
            "nombre": "Santa Cruz"
          },
          {
            "ubigeo": "060612",
            "nombre": "Santo Domingo de La Capilla"
          },
          {
            "ubigeo": "060613",
            "nombre": "Santo Tomas"
          },
          {
            "ubigeo": "060614",
            "nombre": "Socota"
          },
          {
            "ubigeo": "060615",
            "nombre": "Toribio Casanova"
          }
        ]
      },
      {
        "codigo": "0607",
        "nombre": "Hualgayoc",
        "distritos": [
          {
            "ubigeo": "060701",
            "nombre": "Bambamarca"
          },
          {
            "ubigeo": "060702",
            "nombre": "Chugur"
          },
          {
            "ubigeo": "060703",
            "nombre": "Hualgayoc"
          }
        ]
      },
      {
        "codigo": "0608",
        "nombre": "Jaén",
        "distritos": [
          {
            "ubigeo": "060801",
            "nombre": "Jaén"
          },
          {
            "ubigeo": "060802",
            "nombre": "Bellavista"
          },
          {
            "ubigeo": "060803",
            "nombre": "Chontali"
          },
          {
            "ubigeo": "060804",
            "nombre": "Colasay"
          },
          {
            "ubigeo": "060805",
            "nombre": "Huabal"
          },
          {
            "ubigeo": "060806",
            "nombre": "Las Pirias"
          },
          {
            "ubigeo": "060807",
            "nombre": "Pomahuaca"
          },
          {
            "ubigeo": "060808",
            "nombre": "Pucara"
          },
          {
            "ubigeo": "060809",
            "nombre": "Sallique"
          },
          {
            "ubigeo": "060810",
            "nombre": "San Felipe"
          },
          {
            "ubigeo": "060811",
            "nombre": "San Jose del Alto"
          },
          {
            "ubigeo": "060812",
            "nombre": "Santa Rosa"
          }
        ]
      },
      {
        "codigo": "0609",
        "nombre": "San Ignacio",
        "distritos": [
          {
            "ubigeo": "060901",
            "nombre": "San Ignacio"
          },
          {
            "ubigeo": "060902",
            "nombre": "Chirinos"
          },
          {
            "ubigeo": "060903",
            "nombre": "Huarango"
          },
          {
            "ubigeo": "060904",
            "nombre": "La Coipa"
          },
          {
            "ubigeo": "060905",
            "nombre": "Namballe"
          },
          {
            "ubigeo": "060906",
            "nombre": "San Jose de Lourdes"
          },
          {
            "ubigeo": "060907",
            "nombre": "Tabaconas"
          }
        ]
      },
      {
        "codigo": "0610",
        "nombre": "San Marcos",
        "distritos": [
          {
            "ubigeo": "061001",
            "nombre": "Pedro Gálvez"
          },
          {
            "ubigeo": "061002",
            "nombre": "Chancay"
          },
          {
            "ubigeo": "061003",
            "nombre": "Eduardo Villanueva"
          },
          {
            "ubigeo": "061004",
            "nombre": "Gregorio Pita"
          },
          {
            "ubigeo": "061005",
            "nombre": "Ichocan"
          },
          {
            "ubigeo": "061006",
            "nombre": "Jose Manuel Quiroz"
          },
          {
            "ubigeo": "061007",
            "nombre": "Jose Sabogal"
          }
        ]
      },
      {
        "codigo": "0611",
        "nombre": "San Miguel",
        "distritos": [
          {
            "ubigeo": "061101",
            "nombre": "San Miguel"
          },
          {
            "ubigeo": "061102",
            "nombre": "Bolivar"
          },
          {
            "ubigeo": "061103",
            "nombre": "Calquis"
          },
          {
            "ubigeo": "061104",
            "nombre": "Catilluc"
          },
          {
            "ubigeo": "061105",
            "nombre": "El Prado"
          },
          {
            "ubigeo": "061106",
            "nombre": "La Florida"
          },
          {
            "ubigeo": "061107",
            "nombre": "Llapa"
          },
          {
            "ubigeo": "061108",
            "nombre": "Nanchoc"
          },
          {
            "ubigeo": "061109",
            "nombre": "Niepos"
          },
          {
            "ubigeo": "061110",
            "nombre": "San Gregorio"
          },
          {
            "ubigeo": "061111",
            "nombre": "San Silvestre de Cochan"
          },
          {
            "ubigeo": "061112",
            "nombre": "Tongod"
          },
          {
            "ubigeo": "061113",
            "nombre": "Union Agua Blanca"
          }
        ]
      },
      {
        "codigo": "0612",
        "nombre": "San Pablo",
        "distritos": [
          {
            "ubigeo": "061201",
            "nombre": "San Pablo"
          },
          {
            "ubigeo": "061202",
            "nombre": "San Bernardino"
          },
          {
            "ubigeo": "061203",
            "nombre": "San Luis"
          },
          {
            "ubigeo": "061204",
            "nombre": "Tumbaden"
          }
        ]
      },
      {
        "codigo": "0613",
        "nombre": "Santa Cruz",
        "distritos": [
          {
            "ubigeo": "061301",
            "nombre": "Santa Cruz"
          },
          {
            "ubigeo": "061302",
            "nombre": "Andabamba"
          },
          {
            "ubigeo": "061303",
            "nombre": "Catache"
          },
          {
            "ubigeo": "061304",
            "nombre": "Chancaybaños"
          },
          {
            "ubigeo": "061305",
            "nombre": "La Esperanza"
          },
          {
            "ubigeo": "061306",
            "nombre": "Ninabamba"
          },
          {
            "ubigeo": "061307",
            "nombre": "Pulan"
          },
          {
            "ubigeo": "061308",
            "nombre": "Saucepampa"
          },
          {
            "ubigeo": "061309",
            "nombre": "Sexi"
          },
          {
            "ubigeo": "061310",
            "nombre": "Uticyacu"
          },
          {
            "ubigeo": "061311",
            "nombre": "Yauyucan"
          }
        ]
      }
    ]
  },
  {
    "codigo": "07",
    "nombre": "Callao",
    "provincias": [
      {
        "codigo": "0701",
        "nombre": "Callao",
        "distritos": [
          {
            "ubigeo": "070101",
            "nombre": "Callao"
          },
          {
            "ubigeo": "070102",
            "nombre": "Bellavista"
          },
          {
            "ubigeo": "070103",
            "nombre": "Carmen de La Legua"
          },
          {
            "ubigeo": "070104",
            "nombre": "La Perla"
          },
          {
            "ubigeo": "070105",
            "nombre": "La Punta"
          },
          {
            "ubigeo": "070106",
            "nombre": "Ventanilla"
          },
          {
            "ubigeo": "070107",
            "nombre": "Mi Perú"
          }
        ]
      }
    ]
  },
  {
    "codigo": "08",
    "nombre": "Cusco",
    "provincias": [
      {
        "codigo": "0801",
        "nombre": "Cusco",
        "distritos": [
          {
            "ubigeo": "080101",
            "nombre": "Cusco"
          },
          {
            "ubigeo": "080102",
            "nombre": "Ccorca"
          },
          {
            "ubigeo": "080103",
            "nombre": "Poroy"
          },
          {
            "ubigeo": "080104",
            "nombre": "San Jerónimo"
          },
          {
            "ubigeo": "080105",
            "nombre": "San Sebastian"
          },
          {
            "ubigeo": "080106",
            "nombre": "Santiago"
          },
          {
            "ubigeo": "080107",
            "nombre": "Saylla"
          },
          {
            "ubigeo": "080108",
            "nombre": "Wanchaq"
          }
        ]
      },
      {
        "codigo": "0802",
        "nombre": "Acomayo",
        "distritos": [
          {
            "ubigeo": "080201",
            "nombre": "Acomayo"
          },
          {
            "ubigeo": "080202",
            "nombre": "Acopia"
          },
          {
            "ubigeo": "080203",
            "nombre": "Acos"
          },
          {
            "ubigeo": "080204",
            "nombre": "Mosoc Llacta"
          },
          {
            "ubigeo": "080205",
            "nombre": "Pomacanchi"
          },
          {
            "ubigeo": "080206",
            "nombre": "Rondocan"
          },
          {
            "ubigeo": "080207",
            "nombre": "Sangarara"
          }
        ]
      },
      {
        "codigo": "0803",
        "nombre": "Anta",
        "distritos": [
          {
            "ubigeo": "080301",
            "nombre": "Anta"
          },
          {
            "ubigeo": "080302",
            "nombre": "Ancahuasi"
          },
          {
            "ubigeo": "080303",
            "nombre": "Cachimayo"
          },
          {
            "ubigeo": "080304",
            "nombre": "Chinchaypujio"
          },
          {
            "ubigeo": "080305",
            "nombre": "Huarocondo"
          },
          {
            "ubigeo": "080306",
            "nombre": "Limatambo"
          },
          {
            "ubigeo": "080307",
            "nombre": "Mollepata"
          },
          {
            "ubigeo": "080308",
            "nombre": "Pucyura"
          },
          {
            "ubigeo": "080309",
            "nombre": "Zurite"
          }
        ]
      },
      {
        "codigo": "0804",
        "nombre": "Calca",
        "distritos": [
          {
            "ubigeo": "080401",
            "nombre": "Calca"
          },
          {
            "ubigeo": "080402",
            "nombre": "Coya"
          },
          {
            "ubigeo": "080403",
            "nombre": "Lamay"
          },
          {
            "ubigeo": "080404",
            "nombre": "Lares"
          },
          {
            "ubigeo": "080405",
            "nombre": "Pisac"
          },
          {
            "ubigeo": "080406",
            "nombre": "San Salvador"
          },
          {
            "ubigeo": "080407",
            "nombre": "Taray"
          },
          {
            "ubigeo": "080408",
            "nombre": "Yanatile"
          }
        ]
      },
      {
        "codigo": "0805",
        "nombre": "Canas",
        "distritos": [
          {
            "ubigeo": "080501",
            "nombre": "Yanaoca"
          },
          {
            "ubigeo": "080502",
            "nombre": "Checca"
          },
          {
            "ubigeo": "080503",
            "nombre": "Kunturkanki"
          },
          {
            "ubigeo": "080504",
            "nombre": "Langui"
          },
          {
            "ubigeo": "080505",
            "nombre": "Layo"
          },
          {
            "ubigeo": "080506",
            "nombre": "Pampamarca"
          },
          {
            "ubigeo": "080507",
            "nombre": "Quehue"
          },
          {
            "ubigeo": "080508",
            "nombre": "Tupac Amaru"
          }
        ]
      },
      {
        "codigo": "0806",
        "nombre": "Canchis",
        "distritos": [
          {
            "ubigeo": "080601",
            "nombre": "Sicuani"
          },
          {
            "ubigeo": "080602",
            "nombre": "Checacupe"
          },
          {
            "ubigeo": "080603",
            "nombre": "Combapata"
          },
          {
            "ubigeo": "080604",
            "nombre": "Marangani"
          },
          {
            "ubigeo": "080605",
            "nombre": "Pitumarca"
          },
          {
            "ubigeo": "080606",
            "nombre": "San Pablo"
          },
          {
            "ubigeo": "080607",
            "nombre": "San Pedro"
          },
          {
            "ubigeo": "080608",
            "nombre": "Tinta"
          }
        ]
      },
      {
        "codigo": "0807",
        "nombre": "Chumbivilcas",
        "distritos": [
          {
            "ubigeo": "080701",
            "nombre": "Santo Tomas"
          },
          {
            "ubigeo": "080702",
            "nombre": "Capacmarca"
          },
          {
            "ubigeo": "080703",
            "nombre": "Chamaca"
          },
          {
            "ubigeo": "080704",
            "nombre": "Colquemarca"
          },
          {
            "ubigeo": "080705",
            "nombre": "Livitaca"
          },
          {
            "ubigeo": "080706",
            "nombre": "Llusco"
          },
          {
            "ubigeo": "080707",
            "nombre": "Quiñota"
          },
          {
            "ubigeo": "080708",
            "nombre": "Velille"
          }
        ]
      },
      {
        "codigo": "0808",
        "nombre": "Espinar",
        "distritos": [
          {
            "ubigeo": "080801",
            "nombre": "Espinar"
          },
          {
            "ubigeo": "080802",
            "nombre": "Condoroma"
          },
          {
            "ubigeo": "080803",
            "nombre": "Coporaque"
          },
          {
            "ubigeo": "080804",
            "nombre": "Ocoruro"
          },
          {
            "ubigeo": "080805",
            "nombre": "Pallpata"
          },
          {
            "ubigeo": "080806",
            "nombre": "Pichigua"
          },
          {
            "ubigeo": "080807",
            "nombre": "Suyckutambo"
          },
          {
            "ubigeo": "080808",
            "nombre": "Alto Pichigua"
          }
        ]
      },
      {
        "codigo": "0809",
        "nombre": "La Convención",
        "distritos": [
          {
            "ubigeo": "080901",
            "nombre": "Santa Ana"
          },
          {
            "ubigeo": "080902",
            "nombre": "Echarate"
          },
          {
            "ubigeo": "080903",
            "nombre": "Huayopata"
          },
          {
            "ubigeo": "080904",
            "nombre": "Maranura"
          },
          {
            "ubigeo": "080905",
            "nombre": "Ocobamba"
          },
          {
            "ubigeo": "080906",
            "nombre": "Quellouno"
          },
          {
            "ubigeo": "080907",
            "nombre": "Kimbiri"
          },
          {
            "ubigeo": "080908",
            "nombre": "Santa Teresa"
          },
          {
            "ubigeo": "080909",
            "nombre": "Vilcabamba"
          },
          {
            "ubigeo": "080910",
            "nombre": "Pichari"
          },
          {
            "ubigeo": "080911",
            "nombre": "Inkawasi"
          },
          {
            "ubigeo": "080912",
            "nombre": "Villa Virgen"
          },
          {
            "ubigeo": "080913",
            "nombre": "Villa Kintiarina"
          },
          {
            "ubigeo": "080914",
            "nombre": "Megantoni"
          }
        ]
      },
      {
        "codigo": "0810",
        "nombre": "Paruro",
        "distritos": [
          {
            "ubigeo": "081001",
            "nombre": "Paruro"
          },
          {
            "ubigeo": "081002",
            "nombre": "Accha"
          },
          {
            "ubigeo": "081003",
            "nombre": "Ccapi"
          },
          {
            "ubigeo": "081004",
            "nombre": "Colcha"
          },
          {
            "ubigeo": "081005",
            "nombre": "Huanoquite"
          },
          {
            "ubigeo": "081006",
            "nombre": "Omacha"
          },
          {
            "ubigeo": "081007",
            "nombre": "Paccaritambo"
          },
          {
            "ubigeo": "081008",
            "nombre": "Pillpinto"
          },
          {
            "ubigeo": "081009",
            "nombre": "Yaurisque"
          }
        ]
      },
      {
        "codigo": "0811",
        "nombre": "Paucartambo",
        "distritos": [
          {
            "ubigeo": "081101",
            "nombre": "Paucartambo"
          },
          {
            "ubigeo": "081102",
            "nombre": "Caicay"
          },
          {
            "ubigeo": "081103",
            "nombre": "Challabamba"
          },
          {
            "ubigeo": "081104",
            "nombre": "Colquepata"
          },
          {
            "ubigeo": "081105",
            "nombre": "Huancarani"
          },
          {
            "ubigeo": "081106",
            "nombre": "Kosñipata"
          }
        ]
      },
      {
        "codigo": "0812",
        "nombre": "Quispicanchi",
        "distritos": [
          {
            "ubigeo": "081201",
            "nombre": "Urcos"
          },
          {
            "ubigeo": "081202",
            "nombre": "Andahuaylillas"
          },
          {
            "ubigeo": "081203",
            "nombre": "Camanti"
          },
          {
            "ubigeo": "081204",
            "nombre": "Ccarhuayo"
          },
          {
            "ubigeo": "081205",
            "nombre": "Ccatca"
          },
          {
            "ubigeo": "081206",
            "nombre": "Cusipata"
          },
          {
            "ubigeo": "081207",
            "nombre": "Huaro"
          },
          {
            "ubigeo": "081208",
            "nombre": "Lucre"
          },
          {
            "ubigeo": "081209",
            "nombre": "Marcapata"
          },
          {
            "ubigeo": "081210",
            "nombre": "Ocongate"
          },
          {
            "ubigeo": "081211",
            "nombre": "Oropesa"
          },
          {
            "ubigeo": "081212",
            "nombre": "Quiquijana"
          }
        ]
      },
      {
        "codigo": "0813",
        "nombre": "Urubamba",
        "distritos": [
          {
            "ubigeo": "081301",
            "nombre": "Urubamba"
          },
          {
            "ubigeo": "081302",
            "nombre": "Chinchero"
          },
          {
            "ubigeo": "081303",
            "nombre": "Huayllabamba"
          },
          {
            "ubigeo": "081304",
            "nombre": "Machupicchu"
          },
          {
            "ubigeo": "081305",
            "nombre": "Maras"
          },
          {
            "ubigeo": "081306",
            "nombre": "Ollantaytambo"
          },
          {
            "ubigeo": "081307",
            "nombre": "Yucay"
          }
        ]
      }
    ]
  },
  {
    "codigo": "09",
    "nombre": "Huancavelica",
    "provincias": [
      {
        "codigo": "0901",
        "nombre": "Huancavelica",
        "distritos": [
          {
            "ubigeo": "090101",
            "nombre": "Huancavelica"
          },
          {
            "ubigeo": "090102",
            "nombre": "Acobambilla"
          },
          {
            "ubigeo": "090103",
            "nombre": "Acoria"
          },
          {
            "ubigeo": "090104",
            "nombre": "Conayca"
          },
          {
            "ubigeo": "090105",
            "nombre": "Cuenca"
          },
          {
            "ubigeo": "090106",
            "nombre": "Huachocolpa"
          },
          {
            "ubigeo": "090107",
            "nombre": "Huayllahuara"
          },
          {
            "ubigeo": "090108",
            "nombre": "Izcuchaca"
          },
          {
            "ubigeo": "090109",
            "nombre": "Laria"
          },
          {
            "ubigeo": "090110",
            "nombre": "Manta"
          },
          {
            "ubigeo": "090111",
            "nombre": "Mariscal Cáceres"
          },
          {
            "ubigeo": "090112",
            "nombre": "Moya"
          },
          {
            "ubigeo": "090113",
            "nombre": "Nuevo Occoro"
          },
          {
            "ubigeo": "090114",
            "nombre": "Palca"
          },
          {
            "ubigeo": "090115",
            "nombre": "Pilchaca"
          },
          {
            "ubigeo": "090116",
            "nombre": "Vilca"
          },
          {
            "ubigeo": "090117",
            "nombre": "Yauli"
          },
          {
            "ubigeo": "090118",
            "nombre": "Ascensión"
          },
          {
            "ubigeo": "090119",
            "nombre": "Huando"
          }
        ]
      },
      {
        "codigo": "0902",
        "nombre": "Acobamba",
        "distritos": [
          {
            "ubigeo": "090201",
            "nombre": "Acobamba"
          },
          {
            "ubigeo": "090202",
            "nombre": "Andabamba"
          },
          {
            "ubigeo": "090203",
            "nombre": "Anta"
          },
          {
            "ubigeo": "090204",
            "nombre": "Caja"
          },
          {
            "ubigeo": "090205",
            "nombre": "Marcas"
          },
          {
            "ubigeo": "090206",
            "nombre": "Paucara"
          },
          {
            "ubigeo": "090207",
            "nombre": "Pomacocha"
          },
          {
            "ubigeo": "090208",
            "nombre": "Rosario"
          }
        ]
      },
      {
        "codigo": "0903",
        "nombre": "Angaraes",
        "distritos": [
          {
            "ubigeo": "090301",
            "nombre": "Lircay"
          },
          {
            "ubigeo": "090302",
            "nombre": "Anchonga"
          },
          {
            "ubigeo": "090303",
            "nombre": "Callanmarca"
          },
          {
            "ubigeo": "090304",
            "nombre": "Ccochaccasa"
          },
          {
            "ubigeo": "090305",
            "nombre": "Chincho"
          },
          {
            "ubigeo": "090306",
            "nombre": "Congalla"
          },
          {
            "ubigeo": "090307",
            "nombre": "Huanca-Huanca"
          },
          {
            "ubigeo": "090308",
            "nombre": "Huayllay Grande"
          },
          {
            "ubigeo": "090309",
            "nombre": "Julcamarca"
          },
          {
            "ubigeo": "090310",
            "nombre": "San Antonio de Antaparco"
          },
          {
            "ubigeo": "090311",
            "nombre": "Santo Tomas de Pata"
          },
          {
            "ubigeo": "090312",
            "nombre": "Secclla"
          }
        ]
      },
      {
        "codigo": "0904",
        "nombre": "Castrovirreyna",
        "distritos": [
          {
            "ubigeo": "090401",
            "nombre": "Castrovirreyna"
          },
          {
            "ubigeo": "090402",
            "nombre": "Arma"
          },
          {
            "ubigeo": "090403",
            "nombre": "Aurahua"
          },
          {
            "ubigeo": "090404",
            "nombre": "Capillas"
          },
          {
            "ubigeo": "090405",
            "nombre": "Chupamarca"
          },
          {
            "ubigeo": "090406",
            "nombre": "Cocas"
          },
          {
            "ubigeo": "090407",
            "nombre": "Huachos"
          },
          {
            "ubigeo": "090408",
            "nombre": "Huamatambo"
          },
          {
            "ubigeo": "090409",
            "nombre": "Mollepampa"
          },
          {
            "ubigeo": "090410",
            "nombre": "San Juan"
          },
          {
            "ubigeo": "090411",
            "nombre": "Santa Ana"
          },
          {
            "ubigeo": "090412",
            "nombre": "Tantara"
          },
          {
            "ubigeo": "090413",
            "nombre": "Ticrapo"
          }
        ]
      },
      {
        "codigo": "0905",
        "nombre": "Churcampa",
        "distritos": [
          {
            "ubigeo": "090501",
            "nombre": "Churcampa"
          },
          {
            "ubigeo": "090502",
            "nombre": "Anco"
          },
          {
            "ubigeo": "090503",
            "nombre": "Chinchihuasi"
          },
          {
            "ubigeo": "090504",
            "nombre": "El Carmen"
          },
          {
            "ubigeo": "090505",
            "nombre": "La Merced"
          },
          {
            "ubigeo": "090506",
            "nombre": "Locroja"
          },
          {
            "ubigeo": "090507",
            "nombre": "Paucarbamba"
          },
          {
            "ubigeo": "090508",
            "nombre": "San Miguel de Mayocc"
          },
          {
            "ubigeo": "090509",
            "nombre": "San Pedro de Coris"
          },
          {
            "ubigeo": "090510",
            "nombre": "Pachamarca"
          },
          {
            "ubigeo": "090511",
            "nombre": "Cosme"
          }
        ]
      },
      {
        "codigo": "0906",
        "nombre": "Huaytara",
        "distritos": [
          {
            "ubigeo": "090601",
            "nombre": "Huaytara"
          },
          {
            "ubigeo": "090602",
            "nombre": "Ayavi"
          },
          {
            "ubigeo": "090603",
            "nombre": "Córdova"
          },
          {
            "ubigeo": "090604",
            "nombre": "Huayacundo Arma"
          },
          {
            "ubigeo": "090605",
            "nombre": "Laramarca"
          },
          {
            "ubigeo": "090606",
            "nombre": "Ocoyo"
          },
          {
            "ubigeo": "090607",
            "nombre": "Pilpichaca"
          },
          {
            "ubigeo": "090608",
            "nombre": "Querco"
          },
          {
            "ubigeo": "090609",
            "nombre": "Quito-Arma"
          },
          {
            "ubigeo": "090610",
            "nombre": "San Antonio de Cusicancha"
          },
          {
            "ubigeo": "090611",
            "nombre": "San Francisco de Sangayaico"
          },
          {
            "ubigeo": "090612",
            "nombre": "San Isidro"
          },
          {
            "ubigeo": "090613",
            "nombre": "Santiago de Chocorvos"
          },
          {
            "ubigeo": "090614",
            "nombre": "Santiago de Quirahuara"
          },
          {
            "ubigeo": "090615",
            "nombre": "Santo Domingo de Capillas"
          },
          {
            "ubigeo": "090616",
            "nombre": "Tambo"
          }
        ]
      },
      {
        "codigo": "0907",
        "nombre": "Tayacaja",
        "distritos": [
          {
            "ubigeo": "090701",
            "nombre": "Pampas"
          },
          {
            "ubigeo": "090702",
            "nombre": "Acostambo"
          },
          {
            "ubigeo": "090703",
            "nombre": "Acraquia"
          },
          {
            "ubigeo": "090704",
            "nombre": "Ahuaycha"
          },
          {
            "ubigeo": "090705",
            "nombre": "Colcabamba"
          },
          {
            "ubigeo": "090706",
            "nombre": "Daniel Hernández"
          },
          {
            "ubigeo": "090707",
            "nombre": "Huachocolpa"
          },
          {
            "ubigeo": "090709",
            "nombre": "Huaribamba"
          },
          {
            "ubigeo": "090710",
            "nombre": "Ñahuimpuquio"
          },
          {
            "ubigeo": "090711",
            "nombre": "Pazos"
          },
          {
            "ubigeo": "090713",
            "nombre": "Quishuar"
          },
          {
            "ubigeo": "090714",
            "nombre": "Salcabamba"
          },
          {
            "ubigeo": "090715",
            "nombre": "Salcahuasi"
          },
          {
            "ubigeo": "090716",
            "nombre": "San Marcos de Rocchac"
          },
          {
            "ubigeo": "090717",
            "nombre": "Surcubamba"
          },
          {
            "ubigeo": "090718",
            "nombre": "Tintay Puncu"
          },
          {
            "ubigeo": "090719",
            "nombre": "Quichuas"
          },
          {
            "ubigeo": "090720",
            "nombre": "Andaymarca"
          },
          {
            "ubigeo": "090721",
            "nombre": "Roble"
          },
          {
            "ubigeo": "090722",
            "nombre": "Pichos"
          },
          {
            "ubigeo": "090723",
            "nombre": "Santiago de Tucuma"
          }
        ]
      }
    ]
  }
];

export function getUbigeo(departamento: string, provincia: string, distrito: string): string | undefined {
  return UBIGEO_FLAT.find(
    u => u.departamento === departamento && u.provincia === provincia && u.distrito === distrito
  )?.ubigeo;
}

export function getUbigeoInfo(ubigeo: string): UbigeoDistrito | undefined {
  return UBIGEO_FLAT.find(u => u.ubigeo === ubigeo);
}

export const DEPARTAMENTOS: string[] = UBIGEO_NESTED.map(d => d.nombre);

export function getProvincias(departamento: string): string[] {
  const dep = UBIGEO_NESTED.find(d => d.nombre === departamento);
  return dep ? dep.provincias.map(p => p.nombre) : [];
}

export function getDistritos(departamento: string, provincia: string): string[] {
  const dep = UBIGEO_NESTED.find(d => d.nombre === departamento);
  if (!dep) return [];
  const prov = dep.provincias.find(p => p.nombre === provincia);
  return prov ? prov.distritos.map(d => d.nombre) : [];
}

export function getCodigoUbigeo(departamento: string, provincia: string, distrito: string): string {
  return getUbigeo(departamento, provincia, distrito) ?? '';
}
