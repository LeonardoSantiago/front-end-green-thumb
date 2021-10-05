import images from './images/icons/*.svg'

const isMobile = window.innerWidth < 760

const PlantList = function () {
  this.plants  = []
  this.params = { sun: '', water: '', pets: ''}
}

PlantList.prototype.getListOfPlants = function(){
  const { sun, water, pets } = this.params 
  fetch(`https://front-br-challenges.web.app/api/v2/green-thumb/?sun=${sun}&water=${water}&pets=${pets}`).then((response) => {
    response.json().then((response) => {
      if(Array.isArray(response)){
        this.plants = response
        plantList.showResults()
      }
    })
  })
}

PlantList.prototype.setParams = function(param, value){
  this.params[param] = value
}

PlantList.prototype.renderIcons = function(sun, water, toxicity) {
  return (
    `<div class="icons">
        <img src="${images[`${sun}-sun`]}" />
        <img src="${images[water]}" />
        <img src="${images[toxicity ? 'toxic': 'pet']}" />
     </div>
    `
  )
}

PlantList.prototype.renderPlant = function(plant, index) {
  const { url, name, sun, price, water, toxicity } = plant
  return `
    <div class="item item-${index}">
     ${plant.staff_favorite ? `<div class="staff-favorite-text"> Staff Favorite</div>` : ``}
      <img src=${url} />
      <span title="${name}">${name}</span>
      <div class="item-footer">
        $${price}
        ${plantList.renderIcons(sun, water, toxicity)}
      </div>
    </div>
  `
}

PlantList.prototype.renderStaffFavorite = function(plant) {
  const { url, name, sun, price, water, toxicity } = plant
  return `
    <div class="staff-favorite">
      <div class="staff-favorite-text"> Staff Favorite</div>
      <img src=${url} />
      <div class="item-footer">
        <span title="${name}">${name}</span>
        <div>
          $${price}
          ${plantList.renderIcons(sun, water, toxicity)}
        </div>
      </div>
    </div>
  `
}

PlantList.prototype.showResults = function() {
  document.getElementById("container-no-results").style.display = "none"
  document.getElementById("container-results").style.display = isMobile ? "flex" : "grid"
  let template = ''
  this.plants.forEach((plant, index) => {
    if(plant.staff_favorite && !isMobile) template = template + plantList.renderStaffFavorite(plant)
    else template = template + plantList.renderPlant(plant, index)
  })
  document.getElementById("result").innerHTML = template
}

const plantList = new PlantList()

document.querySelectorAll('select').forEach((selectComponent) => {
  selectComponent.addEventListener('change', (event) => {
    const selectTarget = event.target
    const paramName = selectTarget.id
    const value = selectTarget.value

    plantList.setParams(paramName, value)
    plantList.getListOfPlants()
  })
})

document.getElementById('back-top').addEventListener('click', () => {
  window.location.href = "#header"
})