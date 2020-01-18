# API_CARS
 >Witam w moim API jest to pewnego rodzaju
>baza samochodów osobowych w ktorej można dodać/usunąć/zaktualizować
>dane pojazdu, szukać po nazwie lub modelu,
>dodać komentarz, dodać użytkownika i zalogować się.

# Opis:
>Backend- czyli to czego nie widać po wejściu na 
>stronę internetową, czyli całe jej zaplecze 
>techniczne. Użytkownicy stron nie widzą panelu
>administracyjnego i całej struktury strony stworzonej 
>przez webmastera. To właśnie to, co niewidoczne, ale 
>niezbędne do funkcjonowania strony nazywamy backendem.

## 1. Modele
- A. Cars
- B. Comment
- C. User

### A. Cars:
>Deklarujemy Zmienne oraz przypisujemy do każdego 
>samochodu komentarze które mogą być dodawane.
>Każdy samochód ma takie dane jak nazwa, model, 
>pojemność, konie mechaniczne.

- KOD:
```sh
const mongoose = require("mongoose");

const carSchema = mongoose.Schema({
    _id: mongoose.Types.ObjectId,
    comments: [
        {type: mongoose.Schema.Types.ObjectId, ref: 'Comment'}
    ],
    name: String,
    model: String,
    capacity: Number,
    horsepower: Number,
});

module.exports = mongoose.model("Car", carSchema);
```
### B. Comment:
>Deklarujemy Zmienne oraz pokazujemy każdy przypisany 
>komentarz.Każdy komentarz ma takie dane jak tytuł, 
>nazwa użytkownika, treść.

- KOD:
```sh
const mongoose = require("mongoose");

const commentSchema = mongoose.Schema({
    _id: mongoose.Types.ObjectId,
    car: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Car'
    },
    title: String,
    userName: String,
    content: String
});

module.exports = mongoose.model("Comment", commentSchema);
```
### C. User:
>Deklarujemy zmienne oraz 
>szyfrujemy hasła.

- KOD:

```sh
const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    email: { 
        type: String, 
        required: true, 
        unique: true,
        match: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
    },
    password: { type: String, required: true}
});
module.exports = mongoose.model("User", userSchema);
```

## 2. Routes
- A. Cars
- B. Comments
- C. Users

### A. Cars:
##### GET:
>Pokazuje nam dodane samochody.
```sh
router.get("/", (req, res, next)=> {
    Car.find().populate("comments").exec()
    .then(docs=> {
        res.status(200).json(docs);
    })
    .catch(err => res.status(500).json({error: err}));
    });
```
##### POST:
>Pozwala nam dodać nowy samochód
>i wyświetla nam informację, że
>dodano nowy samochód
```sh
router.post("/", checkAuth, (req, res, next)=> {
    const car = new Car({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        model: req.body.model,
        capacity: req.body.capacity,
        horsepower: req.body.horsepower
    });
    car.save()
    .then(result => {
        res.status(200).json({
            message: "Dodano nowy samochód",
            createdcar: car
        });
    })
    .catch(err => res.status(500).json({error: err}));
    });
```
##### GET (2):
>Pozwala nam na szukanie samochodu
>poprzez nazwe lub model.
>Za pomocą na przykład:
>localhost:3000/products/carSearch?name=Mercedes-Benz&model=CLA S45 AMG

```sh
router.get("/carSearch", (req, res, next)=> {
    const name = req.query.name;
    const model = req.query.model;
    const SearchParams = {};

    if (name) {

        SearchParams.name = new RegExp(name, 'i');
    }
        
    if (model) {
        SearchParams.model = new RegExp(model, 'i');

    }
    
    Car.find(SearchParams).exec()
    .then(doc => {
        res.status(200).json(doc);
    })
    .catch(err => res.status(500).json({error: err}));
});
```
##### PATCH:
>Pozwala nam zaktualizować dane o samochodzie

```sh
router.patch("/:carId", (req, res, next)=> {
    const id = req.params.carId;
    Car.update({_id:id}, { $set: {
        name: req.body.name,
        model: req.body.model,
        capacity: req.body.capacity,
        horsepower: req.body.horsepower
    }}).exec()
    .then(result=> {
        res.status(200).json({message: "Zmiana informacji samochodu o numerze ID " + id});
    })
    .catch(err => res.status(500).json({error: err}));
    });
```
##### DELETE:
Pozwala nam usunąć dodany pojazd

```sh
router.delete("/:carId", (req, res, next)=> {
    const id = req.params.carId;
    Car.remove({_id: id}).exec()
    .then(result=> {
        res.status(200).json({message: "Usunięcie samochodu o numerze ID " + id});
    })
    .catch(err => res.status(500).json({error: err}));
    });
```
### B. Comments:
>Na chwilę obecną komentarze można tylko dodawać,
>ale zasada jest jak w poprzednich routes.
>Dodajemy komentarze które są wyświetlane
>podczas wywoływania funkcji GET.

##### POST:

```sh
router.post("/", checkAuth, (req, res, next)=> {
    Car.findById(req.body.car).then((car) => {
        const comment = new Comment({
            _id: new mongoose.Types.ObjectId(),
           car: car._id,
           title: req.body.title,
           userName: req.body.userName,
           content: req.body.content
       });
       
       comment.save()
       .then(result => {
            car.comments.push(result);
            car.save().then(() => {
                res.status(200).json({
                    message: "Dodano nowy komentarz",
                    createdcomment: comment
                });
            });
       })
       .catch(err => res.status(500).json({error: err}));
    })
});
```
### C. Users:
> funkcje są podobne możemy dodać użytkownika za pomocą POST,
> Usunąć za pomocą DELETE,
>Zalogować się dodanym użytkownikiem,
>Jeżeli użytkownik jest błędny pokaże błąd autoryzacji,
>ale jeżeli zalogujemy się poprawnie pokaże
>autoryzacja poprawna.

## 3. Middleware
- A. CHeck-Auth

##### A. Check-Auth:
>Niestety na chwile obecną jest wyłączona, ponieważ
>coś nie działa poprawnie i w niedalekiej przyszłości
>zostanie poprawione.
