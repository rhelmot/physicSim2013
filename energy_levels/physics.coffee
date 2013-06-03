
planck_constant =
  Js: 6.62606957e-34
  eVs: 4.135667516e-15

light_speed =
  mps: 299792458
  nmps: 299792458e9

class EnergyLevel
  constructor: (@energy, @electrons=0) ->

  @fromWavelength: (lambda) ->
    new EnergyLevel planck_constant.eVs * light_speed.nmps / lambda

Array.prototype.random = ->
  i = Math.floor(Math.random() * @length)
  {i: i, e: this[i]}

class Atom
  constructor: (@levels) ->
    @levels.sort (a, b) ->
      if a.energy > b.energy
        1
      else if a.energy < b.energy
        -1
      else
        0

  addElectron: (level) -> ++@levels[level].electrons

  removeElectron: (level) -> --@levels[level].electrons

  incomingPhoton: (energy, levelFrom) ->
    out =
      photonEnergy: energy
      levelTo: null
    if @levels[levelFrom].electrons > 0
      possibleJumps = @levels.slice(levelFrom).map (e) -> energy - e
      {i, level} = possibleJumps.random()
      out.levelTo = i + levelFrom
      out.photonEnergy = level.energy @levels[levelFrom].energy
    out

  incomingPhotonByWavelength: (lambda) ->
    @incomingPhoton planck_constant.eVs * light_speed.nmps / lambda

if module?
  module.exports =
    EnergyLevel: EnergyLevel
    Atom: Atom