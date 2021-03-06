import React from 'react';
import Map from './Map.js'
import Stats from './Stats.js'

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      map: [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 1, 1, 1, 1, 1, 5, 6, 7, 8, 9, 1, 1, 1, 0],
        [0, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
        [0, 1, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
        [0, 1, 4, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
        [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
        [0, 1, 1, 1, 3, 4, 1, 1, 1, 1, 1, 1, 1, 1, 0],
        [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
        [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
        [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
        [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
        [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
        [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
        [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      ],
      playerXcoord: 4,
      playerYcoord: 4,
      hp: 100,
      maxHp: 200,
      attack: 10,
      level: 1,
      experience: 0,
      floor: -1,
      enemies: {
        enemy1: {
          hp: 25
        },
        enemy2: {
          hp: 25
        },
        enemy3: {
          hp: 25
        },
        enemy4: {
          hp: 25
        },
        enemy5: {
          hp: 25
        },
        enemy6: {
          hp: 25
        }
      }
    }
    this.checkExperience = this.checkExperience.bind(this)
    this.checkNextTile = this.checkNextTile.bind(this)
    this.decreaseFloor = this.decreaseFloor.bind(this)
    this.exchangeAttacks = this.exchangeAttacks.bind(this)
    this.handleKeydown = this.handleKeydown.bind(this)
    this.healthPot = this.healthPot.bind(this)
    this.increaseAttack = this.increaseAttack.bind(this)
    this.increaseExperience = this.increaseExperience.bind(this)
    this.movePlayer = this.movePlayer.bind(this)
    this.resetGame = this.resetGame.bind(this)
    this.turnTileIntoDungeon = this.turnTileIntoDungeon.bind(this)
  }

  componentWillMount() {
    window.removeEventListener('keydown', this.handleKeydown)
  }

  componentDidMount() {
    window.addEventListener('keydown', this.handleKeydown)
  }

  ///////////////////////////////////////////////////////////////////////////////////

  checkExperience() {
    this.setState(function (prevState) {
      return {
        level: Math.floor(prevState.experience/100) + 1
      }
    })
  }

  checkNextTile(x, y) {
    var nextTile = this.state.map[this.state.playerXcoord + x][this.state.playerYcoord + y]
    if ((nextTile) === 1) { // dungeon tile
      this.movePlayer(x, y) //changes state
    } else if (nextTile === 2) { // manhole tile
      this.movePlayer(x, y)
      this.decreaseFloor()
    } else if (nextTile === 3) { // item tile
      this.increaseAttack()
      this.turnTileIntoDungeon(this.state.playerXcoord + x, this.state.playerYcoord + y)
      this.movePlayer(x, y)
    } else if (nextTile === 4) { // health pot tile
      this.healthPot()
      this.turnTileIntoDungeon(this.state.playerXcoord + x, this.state.playerYcoord + y)
      this.movePlayer(x, y)
    } else if (nextTile >= 5) { // enemy tile
      var enemyToAttack = 'enemy' + (nextTile - 4)
      var enemyHpAfterAttack = this.state.enemies[enemyToAttack].hp - this.state.attack
      if (enemyHpAfterAttack <= 0) {
        this.exchangeAttacks(enemyToAttack, 0, 0)
        this.increaseExperience()
        this.turnTileIntoDungeon(this.state.playerXcoord + x, this.state.playerYcoord + y)
        this.movePlayer(x, y)
      } else {
        this.exchangeAttacks(enemyToAttack, enemyHpAfterAttack, this.state.floor * 15)
      }
    }
  }

  decreaseFloor() {
    this.setState(function (prevState) {
      return {
        map: [
          [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          [0, 1, 1, 1, 1, 1, 5, 6, 7, 8, 9, 1, 1, 1, 0],
          [0, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
          [0, 1, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
          [0, 1, 4, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
          [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
          [0, 1, 1, 1, 3, 4, 1, 1, 1, 1, 1, 1, 1, 1, 0],
          [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
          [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
          [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
          [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
          [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
          [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
          [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
          [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        ],
        playerXcoord: 4,
        playerYcoord: 4,
        floor: prevState.floor - 1,
        enemies: {
          enemy1: {
            hp: 25 * (-1) * (prevState.floor - 1)
          },
          enemy2: {
            hp: 25 * (-1) * (prevState.floor - 1)
          },
          enemy3: {
            hp: 25 * (-1) * (prevState.floor - 1)
          },
          enemy4: {
            hp: 25 * (-1) * (prevState.floor - 1)
          },
          enemy5: {
            hp: 25 * (-1) * (prevState.floor - 1)
          },
          enemy6: {
            hp: 25 * (-1) * (prevState.floor - 1)
          }
        }
      }
    })
  }

  exchangeAttacks(enemyToAttack, newEnemyHp, enemyAttack) {
    this.setState(function (prevState) {
      var tempEnemies = prevState.enemies
      tempEnemies[enemyToAttack].hp = newEnemyHp
      return {
        hp: prevState.hp + enemyAttack,
        enemies: tempEnemies
      }
    })
    if (this.state.hp < 0) {
      window.alert('You died! Start over?')
      this.resetGame()
    }
  }

  handleKeydown(e) {
    switch (e.code) {
      case 'ArrowDown':
        if (this.state.playerXcoord + 1 < this.state.map.length) { // check that nextTile does not exit map
          this.checkNextTile(1, 0)
        }
        break
      case 'ArrowRight':
        if (this.state.playerYcoord + 1 < this.state.map.length) { //verify that player coord + 1 does not exit map
          this.checkNextTile(0, 1)
        }
        break
      case 'ArrowUp':
        if (this.state.playerXcoord - 1 >= 0) { //verify that player coord + 1 does not exit map
          this.checkNextTile(-1, 0)
        }
        break
      case 'ArrowLeft':
        if (this.state.playerYcoord - 1 >= 0) { //verify that player coord + 1 does not exit map
          this.checkNextTile(0, -1)
        }
        break
      default:
      //do nothing
    }
  }

  healthPot() {
    this.setState(function (prevState) {
      var newHealth = prevState.hp + (Math.round(prevState.maxHp * 0.25))
      newHealth = newHealth > prevState.maxHp ? prevState.maxHp : newHealth
      return {
        hp: newHealth
      }
    })
  }

  increaseAttack() {
    this.setState(function (prevState) {
      return {
        attack: prevState.attack + (prevState.floor * (-1) * 10)
      }
    })
  }

  increaseExperience() {
    this.setState(function (prevState) {
      return {
        experience: prevState.experience + 25
      }
    })
    this.checkExperience()
  }

  movePlayer(x, y) {
    this.setState(function (prevState) {
      return {
        playerXcoord: prevState.playerXcoord + x,
        playerYcoord: prevState.playerYcoord + y
      }
    })
  }

  resetGame() {
    this.setState({
      map: [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 1, 1, 1, 1, 1, 5, 6, 7, 8, 9, 1, 1, 1, 0],
        [0, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
        [0, 1, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
        [0, 1, 4, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
        [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
        [0, 1, 1, 1, 3, 4, 1, 1, 1, 1, 1, 1, 1, 1, 0],
        [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
        [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
        [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
        [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
        [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
        [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
        [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      ],
      playerXcoord: 4,
      playerYcoord: 4,
      hp: 100,
      maxHp: 200,
      attack: 10,
      level: 1,
      experience: 0,
      floor: -1,
      enemies: {
        enemy1: {
          hp: 25
        },
        enemy2: {
          hp: 25
        },
        enemy3: {
          hp: 25
        },
        enemy4: {
          hp: 25
        },
        enemy5: {
          hp: 25
        },
        enemy6: {
          hp: 25
        }
      }
    })
  }

  turnTileIntoDungeon(x, y) {
    this.setState(function (prevState) {
      var newMap = prevState.map
      newMap[x][y] = 1
      return {
        map: newMap
      }
    })
  }

  render() {
    return (
      <div>
        <Stats
          hp={this.state.hp}
          maxHp={this.state.maxHp}
          attack={this.state.attack}
          level={this.state.level}
          experience={this.state.experience}
          floor={this.state.floor}
        />
        <div className='map'>
          <Map map={this.state.map} playerCoords={[this.state.playerXcoord, this.state.playerYcoord]} />
        </div>
      </div>
    )
  }
}

export default App
