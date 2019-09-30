export interface Listener {
	cb: Function;
	once: boolean;
}

export interface EventsType {
	[eventName: string]: Listener[];
}

export default class EventListener {
	es: EventsType = {};
	
	on(eventName: string, cb: Function, once: boolean = false) {
		if (!this.es[eventName]) {
			this.es[eventName] = [];
		}

		this.es[eventName].push({
			cb,
			once,
		});
	}

	once(eventName: string, cb: Function) {
		this.on(eventName, cb, true);
	}

	fire(eventName: string, ...params: any[]) {
		const listeners = this.es[eventName] || [];

		let l = listeners.length;

		for (let i = 0; i < l; i++) {
			const { cb, once } = listeners[i];

			cb.apply(this, params);

			if (once) {
				listeners.splice(i, 1);
				i--;
				l--;
			}
		}
	}

	off(eventName?: string, cb?: Function) {
		// clean all
		if (eventName === undefined) {
			this.es = {};
		} else {
			if (cb === undefined) {
				// clean the eventName's listeners
				delete this.es[eventName];
			} else {
				const listeners = this.es[eventName] || [];
				// clean the event and listener
				let l = listeners.length;
				for (let i = 0; i < l; i++) {
					if (listeners[i].cb === cb) {
						listeners.splice(i, 1);
						i--;
						l--;
					}
				}
			}
		}
	}

	// cname of fire
	emit(eventName: string, ...params: any[]) {
		this.fire(eventName, ...params);
	}
}