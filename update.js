const init = require('./init.js')
const collide = require('./collide.js')

function applyActionQueue (snake) {
  switch (snake.actionQueue.shift()) {
    case 'up': {
      up(snake)
      return
    }
    case 'left': {
      left(snake)
      return
    }
    case 'down': {
      down(snake)
      return
    }
    case 'right': {
      right(snake)
      return
    }
  }
}

function moveSnake(snake, game) {
  applyActionQueue(snake)
  snake.tail.unshift({
    x: snake.head.x,
    y: snake.head.y
  })
  snake.tail = snake.tail.slice(0, snake.length)
  snake.head.x += snake.head.dx
  snake.head.y += snake.head.dy
}

function collideSnake(snake, game) {
  if (collide.wallCheck(snake.head, game)) {
    snake.dead = true
    game.overMessage += `${snake.name} hit a wall. `
    return game
  }
  if (collide.cookieCheck(snake.head, game.cookie)) {
    snake.length += 3
    snake.score += 1
    game.cookie = init.cookie(game)
  }
  for (let other of game.snake) {
    if (collide.tailCheck(snake.head, other.tail)) {
      snake.dead = true
      if (snake.name === other.name) {
        game.overMessage += `${snake.name} hit ${snake.pronouns.object}. `
      } else {
        game.overMessage += `${snake.name} hit ${other.name}. `
      }
    }
    if (snake.name !== other.name) {
      if (collide.headCheck(snake.head, other.head)) {
        snake.dead = true
        game.overMessage += `${snake.name} hit ${other.name}. `
      }
    }
  }
}

function up (snake) {
  if (snake.head.dx !== 0) {
    snake.head.dx = 0
    snake.head.dy = -1
  }
}

function left (snake) {
  if (snake.head.dy !== 0) {
    snake.head.dx = -1
    snake.head.dy = 0
  }
}

function down (snake) {
  if (snake.head.dx !== 0) {
    snake.head.dx = 0
    snake.head.dy = 1
  }
}

function right (snake) {
  if (snake.head.dy !== 0) {
    snake.head.dx = 1
    snake.head.dy = 0
  }
}

module.exports = (game, action) => {
  if (action === 'space' || action === 'escape') {
    game.pause = !game.pause
    return game
  }
  if (game.pause) return game
  if (action !== 'clock' && game.over && !game.pause) {
    if (action === '1') {
      game.numSnakes = 1
    } else if (action === '2') {
      game.numSnakes = 2
    }
    return init.game(game)
  }
  switch (action) {
    case 'clock': {
      if (game.over) return game
      for (let snake of game.snake) {
        moveSnake(snake, game)
      }
      for (let snake of game.snake) {
        collideSnake(snake, game)
      }
      for (let snake of game.snake) {
        if (snake.dead) {
          game.over = true
          game.pause = true
          setTimeout(() => game.pause = false, 1000)
          for (let other of game.snake) {
            if (snake.name !== other.name) {
              other.score += 3
            }
          }
        }
      }
      return game;
    }
    case 'w': {
      game.snake[0].actionQueue.push('up')
      return game;
    }
    case 'a': {
      game.snake[0].actionQueue.push('left')
      return game;
    }
    case 's': {
      game.snake[0].actionQueue.push('down')
      return game;
    }
    case 'd': {
      game.snake[0].actionQueue.push('right')
      return game;
    }
    case 'i':
    case 'up': {
      game.snake[game.numSnakes - 1].actionQueue.push('up')
      return game;
    }
    case 'j':
    case 'left': {
      game.snake[game.numSnakes - 1].actionQueue.push('left')
      return game;
    }
    case 'k':
    case 'down': {
      game.snake[game.numSnakes - 1].actionQueue.push('down')
      return game;
    }
    case 'l':
    case 'right': {
      game.snake[game.numSnakes - 1].actionQueue.push('right')
      return game;
    }
    default: {
      return game;
    }
  }
}
