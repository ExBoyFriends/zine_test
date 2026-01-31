// effects.js

// ノイズエフェクトの追加
const addGlitchEffect = (targetElement) => {
  targetElement.addEventListener('touchstart', (e) => {
    const body = document.body;

    // 画面が揺れたり、ノイズが表示されるエフェクト
    body.classList.add('glitch-effect');

    // 長押し終了時の処理
    let timeout;
    const endEffect = () => {
      body.classList.remove('glitch-effect');
      clearTimeout(timeout);
    };

    // 長押し中にエフェクトを持続
    timeout = setTimeout(endEffect, 2000);  // 2秒後にエフェクト終了

    e.preventDefault();
  });
};

// ノイズと歪みを追加するスタイル
const style = document.createElement('style');
style.textContent = `
  .glitch-effect {
    position: relative;
    overflow: hidden;
  }
  
  .glitch-effect::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url('path-to-glitch-effect-image'); /* ノイズ画像 */
    mix-blend-mode: overlay;
    animation: glitch 0.3s infinite;
  }

  @keyframes glitch {
    0% { transform: translate(-2px, 0); }
    25% { transform: translate(2px, -2px); }
    50% { transform: translate(1px, 1px); }
    75% { transform: translate(-1px, 0); }
    100% { transform: translate(0, 2px); }
  }
`;

document.head.append(style);

// 画面全体や特定のエレメントにノイズエフェクトを追加
const targetElement = document.querySelector('.scene'); // ここを必要なエレメントに変更
addGlitchEffect(targetElement);
