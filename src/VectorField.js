// components/VectorField.js
import React, { useEffect, useRef } from 'react';
import p5 from 'p5';

const VectorField = () => {
  const sketchRef = useRef();

  useEffect(() => {
    const sketch = (p) => {
      let cols, rows;
      let scale = 40;
      let vectors = [];
      let ball = p.createVector(0, 0); // Posição da bola

      p.setup = () => {
        p.createCanvas(p.windowWidth, p.windowHeight);
        cols = p.floor(p.width / scale);
        rows = p.floor(p.height / scale);
        vectors = new Array(cols).fill().map(() => new Array(rows));
        p.stroke(0);

        // Inicia a bola na posição do mouse ou toque
        ball.set(p.mouseX, p.mouseY);
      };

      p.draw = () => {
        p.background(255);

        // Atualiza a posição da bola com o toque ou mouse
        if (p.touches.length > 0) {
          ball.set(p.touches[0].x, p.touches[0].y);
        } else {
          ball.set(p.mouseX, p.mouseY);
        }

        // Desenha a bola
        p.fill(0);
        p.ellipse(ball.x, ball.y, 30, 30);

        for (let i = 0; i < cols; i++) {
          for (let j = 0; j < rows; j++) {
            let x = i * scale;
            let y = j * scale;
            let position = p.createVector(x, y);

            // Calcula a direção do vetor apontando para a bola
            let direction = p5.Vector.sub(ball, position);

            // Ajusta o tamanho do vetor baseado na distância até a bola
            let distance = direction.mag();
            let maxSize = 50; // Tamanho máximo dos vetores
            let minSize = 10; // Tamanho mínimo dos vetores
            let size = p.map(distance, 0, p.width / 2, maxSize, minSize);
            size = p.constrain(size, minSize, maxSize);

            direction.setMag(size);

            // Desenha a seta
            drawArrow(position, direction);
          }
        }
      };

      // Função para desenhar uma seta
      const drawArrow = (base, vec) => {
        p.push();
        p.stroke(0);
        p.strokeWeight(2);
        p.fill(0);
        p.translate(base.x, base.y);
        p.line(0, 0, vec.x, vec.y);
        p.rotate(vec.heading());

        p.translate(vec.mag() - 5, 0);
        p.triangle(0, 3, 0, -3, 5, 0);
        p.pop();
      };

      // Redimensiona o canvas conforme o tamanho da janela
      p.windowResized = () => {
        p.resizeCanvas(p.windowWidth, p.windowHeight);
        cols = p.floor(p.width / scale);
        rows = p.floor(p.height / scale);
      };
    };

    const canvas = new p5(sketch, sketchRef.current);
    return () => {
      canvas.remove();
    };
  }, []);

  return <div ref={sketchRef}></div>;
};

export default VectorField;

