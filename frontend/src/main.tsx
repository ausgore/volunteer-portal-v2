import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter, Route, Routes } from "react-router-dom";
import "./main.css";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Events from "./pages/Events";
import EventOld from "./pages/archived/Event_Old";
import Trainings from "./pages/Trainings";
import Training from "./pages/Training";
import Event from "./pages/Event";
import EventsOld from "./pages/archived/Events_Old";

ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<HashRouter>
			<Routes>
				<Route index path="/" element={<Home />} />
				<Route path="/profile" element={<Profile />} />
				<Route path="/events" element={<Events />} />
				<Route path="/events/:eventId/:roleId" element={<Event />} />
				<Route path="/archived/events" element={<EventsOld />} />
				<Route path="/archived/events/:id" element={<EventOld />} />
				<Route path="/trainings" element={<Trainings />} />
				<Route path="/trainings/:id" element={<Training />} />
			</Routes>
		</HashRouter>
	</React.StrictMode>
)