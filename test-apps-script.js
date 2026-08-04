const url = 'https://script.google.com/macros/s/AKfycbwWIAtha5iMCvl04wW6qlTA5TACxMAQzy2jBvymR1Qnf3wUL_KYKMCDHsb2Y2xaWD8gYQ/exec';
const body = JSON.stringify({ completedAt: new Date().toISOString(), refNumber: "TEST-BROWSER" });

async function run() {
  try {
    const res = await fetch(url, {
      method: 'POST',
      body: body,
      headers: { 'Content-Type': 'text/plain;charset=utf-8' }
    });
    console.log(res.status, res.url);
    const text = await res.text();
    console.log(text);
  } catch (e) {
    console.error(e);
  }
}
run();
