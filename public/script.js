window.addEventListener("load", () => {
  const loader = document.querySelector(".loader")
  setTimeout(()=>{
      loader.classList.add("loader-hidden")
      loader.addEventListener("transitionend", () => {
          document.body.removeChild("loader")
      })
  }, )
})
const FORM = document.querySelector("#form");

document.addEventListener('DOMContentLoaded', function() {
  let blocks = document.querySelectorAll('.section');

  function checkBlocksVisibility() {
      let windowHeight = window.innerHeight;

      blocks.forEach(block => {
          let blockPosition = block.getBoundingClientRect().top;

          if (blockPosition < windowHeight - 100) {
              block.style.opacity = "1";
              block.style.transform = "translateY(0)";
          }
      });
  }

  checkBlocksVisibility();

  window.addEventListener('scroll', function() {
      checkBlocksVisibility();
  });


  const backToTop = document.getElementById("toTop");

  window.addEventListener("scroll", function () {
    if (window.pageYOffset > 300) {
      backToTop.style.display = "flex";
    } else {
      backToTop.style.display = "none";
    }
  });

  backToTop.addEventListener("click", function (event) {
    event.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
});



const submitBtn = document.querySelector(".btn-order")
const btnloader = document.querySelector(".btn-loader")

const toaster = document.querySelector(".toaster")
function zayavka(e){
  btnloader.classList.add("btn-loader-hidden")


  toaster.classList.remove("hidden")
  function hdToaster () {
      toaster.classList.add("hidden")
  }
  const feedbackFormData = new FormData(e.target);
  const feedback = Object.fromEntries(feedbackFormData);
  e.target.reset();
  setTimeout(hdToaster, 1100)
  setTimeout(() => sendFeedback(feedback), 1100);
}
const toasterErr = document.querySelector('.toasterErr')
function zayavkaError(){
  btnloader.classList.add("btn-loader-hidden")

  toasterErr.classList.remove("hidden")
  function hdToaster () {
      toasterErr.classList.add("hidden")
  }
  setTimeout(hdToaster, 1100)


}
function validateForm(e) {
  var inputName = document.querySelector('.inputName')
  var inputPhone = document.querySelector('.inputPhone')
  var inputEmail = document.querySelector('.inputEmail')
  var inputDesc = document.querySelector('.discription')

  if (inputName.value === '') {
      setTimeout(zayavkaError, 1200);
      return false;
  }
  if (inputPhone.value === '') {
      setTimeout(zayavkaError, 1200);
      return false;
  }
  if (inputEmail.value === '') {
      setTimeout(zayavkaError, 1200);
      return false;
  }
  if (inputDesc.value === '') {
      setTimeout(zayavkaError, 1200);
      return false;
  }



  setTimeout(() => zayavka(e), 1200);
  return false;
}
FORM.addEventListener("submit", (e) => {
  e.preventDefault();
  btnloader.classList.remove("btn-loader-hidden")

  if (!validateForm(e)) {
    return false;
  }
  zayavka(e);
})
// submitBtn.addEventListener('click', (e) => {
//   e.preventDefault();

//   btnloader.classList.remove("btn-loader-hidden")

//   if (!validateForm(e)) {
//     return false;
//   }
//   zayavka(e);

// })

function sendFeedback(feedback) {
  fetch('/api/feedback', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(feedback),
    })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      console.log("Feedback sent successfully");
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

