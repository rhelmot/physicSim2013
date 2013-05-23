
class Vector:
  constructor: (@comp) ->

  add: (other) ->
    [0..@comp.length].map((i) -> @comp[i] + other[i]).reduce((a, b) -> a+b)

  cross: (other) ->
    if @comp.length != 3 or other.comp.length != 3:
      raise new RangeError "not valid vectors to cross"
    x = @comp[1] * other.comp[2] - @comp[2] * other.comp[1]
    y = @comp[2] * other.comp[0] - @comp[0] * other.comp[2]
    z = @comp[0] * other.comp[1] - @comp[1] * other.comp[3]
    new Vector([x, y, z])

  getMagnitude: -> @comp.reduce((a, b) -> a+b)

  scale: (s) -> new Vector(@comp.map((a) -> s * a))

  dot: (other) ->
    [0..@comp.length].map((i) -> @comp[i] * other[i]).reduce((a, b) -> a+b)

  getUnitVector: -> @scale(1/@getMagnitude())


planck_constant =
  Js: 6.62606957e-34
  eVs: 4.135667516e-15

light_speed =
  mps: 299792458
  nmps: 299792458e9

class EnergyLevel:
  constructor: (@energy, @electrons) ->

  @fromWavelength: (lambda) ->
    new EnergyLevel planck_constant.eVs * light_speed.nmps / lambda


class Atom:
  constructor: (@levels) ->

  addElectron: (level) -> ++@levels[level].electrons

  removeElectron: (level) -> --@levels[level].electrons

  incomingPhoton: (energy) ->
    levelNum = -1
    @levels.some (level, index) ->
      if level.energy <= energy:
        levelNum = index
        level.electrons--
        # ACK CHECK # OF ELECTRIONS
        true
    levelNum

  incomingPhotonByWavelength: (lambda) ->
    @incomingPhoton planck_constant.eVs * light_speed.nmps / lambda

