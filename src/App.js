import React,{useEffect, useState,useRef} from "react";

function App() {
  const [value, setValue] = useState({
		isFetched: false,
		data: {},
		error: false,
	});

 	const [count,setCount] = useState(0)
	const [display,setDisplay] = useState({
		id: null,
		display:false,
		data: {}
	})
	const narx = useRef()
	const narx2 = useRef()
	const nom = useRef()
	const nom2 = useRef()
	const muallif = useRef()
	const muallif2 = useRef()

  useEffect(() => {
		fetch(`http://localhost:9000/books`)
			.then((res) => res.json())
			.then((data) =>
				setValue({
					isFetched: true,
					data: data,
					error: false,
				}),
			)

			.catch(er =>{
				setValue({
					error:true,
					isFetched:false,
				})
			})
		
	}, [count]);

	
	const addBook = (evt) =>{
		evt.preventDefault();
		setCount(count +1)

		fetch('http://localhost:9000/books',{
			method: 'POST',
			headers:{
				'Content-type': 'application/json',
				'Accept': 'application/json'
			},
			mode: 'no-cors',
			body: JSON.stringify({
				title: nom.current.value.trim(),
				price: narx.current.value.trim(),
				author: muallif.current.value.trim(),
			})
		})

		nom.current.value = null
		narx.current.value = null
		muallif.current.value = null
	}

	
	const edit = evt =>{
		const id = evt.target.dataset.id - 0;
		const forValue = value.data.filter(a => a.id === id) 
		
		setDisplay({
			id: id,
			display: true,
			data: forValue
		})
	}
	const editBook = (evt) =>{
		evt.preventDefault();
		setCount(count +1)

		fetch('http://localhost:9000/updateBooks',{
			method: 'POST',
			headers:{
				'Content-type': 'application/json',
				'Accept': 'application/json'
			},
			mode: 'no-cors',
			body: JSON.stringify({
				id: display.id,
				title: nom2.current.value.trim(),
				price: narx2.current.value.trim(),
				author: muallif2.current.value.trim(),
			})
		})

		nom2.current.value = null
		narx2.current.value = null
		muallif2.current.value = null
		setDisplay({
			id:null,
			display:false,
			data: {}
		})
	}

	const deleteBook = evt =>{
		const id = evt.target.dataset.id - 0;

		fetch(`http://localhost:9000/books/${id}`, {
			method: 'POST',
			headers:{
				'Content-type': 'application/json',
				'Accept': 'application/json'
			},
			mode: 'no-cors',
		})

		setCount(count + 1)
	}

  return (
    <div className="App">
		<form autoComplete="off" className="form d-flex mt-2 mx-2" onSubmit={addBook}>
			<input className="form-control me-3" ref={nom} type="text" placeholder="kitob nomi ..." required />
			<input className="form-control" ref={narx} type="text" placeholder="kitob narxi..." required />
			<input className="form-control mx-3" ref={muallif} type="text" placeholder="kitob muallifi" required/>
			<button className="btn btn-primary" type="submit">Qo'shish</button>
		</form>

		<div style={{"zIndex":"5"}} className={display.display ? 'p-3 mt-5 h-100 w-100 position-fixed' :'d-none'}>
			<form autoComplete="off" className='form w-50 d-flex flex-wrap mt-2 mx-2 shadow-lg p-3 mt-5 bg-body rounded' onSubmit={editBook}>
				<input className="form-control" ref={nom2} type="text" placeholder="kitob yangi nomi ..." defaultValue={display.display ? display.data[0].title : null} required />
				<input className="form-control my-3" ref={narx2} type="text" placeholder="kitob yangi narxi..." defaultValue={display.display ? display.data[0].price : null} required />
				<input className="form-control" ref={muallif2} type="text" placeholder="kitob yangi muallifi" defaultValue={display.display ? display.data[0].author : null} required/>
				<button className="btn btn-primary mt-3" type="submit">Tahrirlash</button>
			</form>
			<button style={{"marginTop":"-98px", "marginLeft":"190px"}} className="btn btn-danger" onClick={()=> setDisplay({id:null,display:false})}>Yopish</button>
		</div>
		<h2 className="text-primary mt-5" >Kitoblar jami {value.isFetched ? value.data.length : 0} ta</h2>
      <ol style={{"margin":"0","padding":"0"}} className='list d-flex justify-content-between flex-wrap mx-5'>
	  			{value.error ? (
					<h2>Server bilan muammo!! (internetingizni sozlang yoki localhostda backendegi kodni ishga tushiring..)</h2>
				) : (
					<></>
				)}

				{value.isFetched ? (
					value.data.map((e) => (
						<div key={e.id} className="card" style={{"width": "18rem","marginTop":"40px"}}>
						<img src="https://cdn.picpng.com/book/book-illustration-30958.png" className="card-img-top" alt={e?.title}/>
						<div className="card-body">
						<h5 className="card-title">Nomi: {e?.title}</h5>
						<p className="card-text">Narxi: {e?.price}</p>
						<p className="card-text">Muallif: {e?.author}</p>
						<button className="btn btn-primary ms-2" data-id={e.id} onClick={edit}>Tahrirlash</button>
						<button className="btn btn-danger ms-5" data-id={e.id} onClick={deleteBook} >O'chirish</button>
						</div>
						</div>
                    ))
				) : (
					<img className={value.isFetched ? "d-none" : "loader-img"} src="https://i.gifer.com/origin/b4/b4d657e7ef262b88eb5f7ac021edda87.gif" alt="loader" />
				)}
      </ol>
    </div>
  );
}

export default App;