function Nepremicnina(id, posredovanje, vrsta, velikost, cena, opis, id_lokacije){
	this.id = id;
	this.posredovanje = posredovanje;
	this.vrsta = vrsta;
	this.velikost = velikost;
	this.cena = cena;
	this.opis = opis;
	this.id_lokacije = id_lokacije;
}

Nepremicnina.prototype.toString = function(){
	return 'POSREDOVANJE: ' + this.posredovanje + ', VRSTA: ' + this.vrsta + ', VELIKOST: ' + this.velikost + ', CENA: ' + this.cena + ', OPIS: ' + this.opis;
};

module.exports = Nepremicnina;