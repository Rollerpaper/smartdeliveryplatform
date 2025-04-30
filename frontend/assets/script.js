async function doLogin(e) {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    if (!res.ok) {
      const err = await res.json();
      alert('登录失败: ' + (err.message || res.statusText));
      return;
    }
    alert('登录成功');
    window.location.href = 'dashboard.html';
  }
  
  async function doRegister(e) {
    e.preventDefault();
    const username = document.getElementById('reg-username').value;
    const password = document.getElementById('reg-password').value;
    const role = document.getElementById('reg-role').value;
    const res = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password, role })
    });
    if (!res.ok) {
      const err = await res.json();
      alert('注册失败: ' + (err.message || res.statusText));
      return;
    }
    alert('注册成功，请登录');
    window.location.href = 'login.html';
  }