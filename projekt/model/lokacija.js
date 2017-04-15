function Lokacija(id, kraj, regija, dolzina, sirina){
	this.id = id;
	this.kraj = kraj;
	this.regija = regija;
	this.dolzina = dolzina;
	this.sirina = sirina;
}

Lokacija.prototype.toString = function(){
	return 'KRAJ: ' + this.kraj + ', REGIJA: ' + this.regija;
};

module.exports = Lokacija;