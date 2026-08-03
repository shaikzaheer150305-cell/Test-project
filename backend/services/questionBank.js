const questionBank = {
  'Software Engineer': {
    'Java': {
      beginner: [
        { question: 'What is the difference between JDK, JRE, and JVM?', topic: 'Java Basics', expectedKeyPoints: ['JDK is development kit', 'JRE is runtime environment', 'JVM is virtual machine that runs bytecode'] },
        { question: 'Explain the concept of object-oriented programming and its four pillars.', topic: 'OOP Concepts', expectedKeyPoints: ['Encapsulation', 'Inheritance', 'Polymorphism', 'Abstraction'] },
        { question: 'What are the primitive data types in Java?', topic: 'Data Types', expectedKeyPoints: ['byte, short, int, long', 'float, double', 'char, boolean'] },
        { question: 'What is the difference between `==` and `.equals()` in Java?', topic: 'Java Basics', expectedKeyPoints: ['== compares references', '.equals() compares values', 'String pool concept'] },
        { question: 'Explain the difference between an abstract class and an interface.', topic: 'OOP Concepts', expectedKeyPoints: ['Abstract class can have constructors', 'Interface methods are public by default', 'Multiple interfaces allowed'] },
        { question: 'What is the purpose of the `static` keyword in Java?', topic: 'Java Basics', expectedKeyPoints: ['Belongs to class not instance', 'Static methods can be called without object', 'Static variables shared across instances'] },
        { question: 'What is exception handling in Java? Name the key keywords.', topic: 'Exception Handling', expectedKeyPoints: ['try, catch, finally, throw, throws', 'Checked vs unchecked exceptions', 'Try-with-resources'] },
        { question: 'Explain the difference between ArrayList and LinkedList.', topic: 'Collections', expectedKeyPoints: ['ArrayList uses array', 'LinkedList uses doubly linked list', 'Performance differences for add/remove/get'] },
        { question: 'What is a constructor? What is a copy constructor?', topic: 'OOP Concepts', expectedKeyPoints: ['Special method to initialize objects', 'Copy constructor creates new object from existing', 'Default constructor provided if none defined'] },
        { question: 'What is the difference between `String`, `StringBuilder`, and `StringBuffer`?', topic: 'Java Basics', expectedKeyPoints: ['String is immutable', 'StringBuilder is mutable and not thread-safe', 'StringBuffer is mutable and thread-safe'] },
      ],
      intermediate: [
        { question: 'Explain the Java Memory Model. What are the different areas of the JVM memory?', topic: 'JVM & Memory', expectedKeyPoints: ['Heap memory', 'Stack memory', 'Method area', 'Garbage collection'] },
        { question: 'What are the SOLID principles? Give an example of each.', topic: 'Design Principles', expectedKeyPoints: ['Single Responsibility', 'Open/Closed', 'Liskov Substitution', 'Interface Segregation', 'Dependency Inversion'] },
        { question: 'Explain the difference between fail-fast and fail-safe iterators.', topic: 'Collections', expectedKeyPoints: ['Fail-fast throws ConcurrentModificationException', 'Fail-safe works on clone', 'HashMap is fail-fast, ConcurrentHashMap is fail-safe'] },
        { question: 'What is multithreading in Java? How do you create a thread?', topic: 'Concurrency', expectedKeyPoints: ['Extending Thread class', 'Implementing Runnable', 'Thread lifecycle', 'synchronized keyword'] },
        { question: 'What is the Stream API in Java? Give an example of a pipeline operation.', topic: 'Java 8+ Features', expectedKeyPoints: ['Functional interface', 'map, filter, reduce operations', 'Parallel streams', 'Collectors'] },
        { question: 'Explain HashMap internals. What happens during a collision?', topic: 'Collections', expectedKeyPoints: ['Array of buckets', 'Linked list for collisions', 'Treeify threshold at 8', 'Load factor and rehashing'] },
        { question: 'What is the difference between `Comparable` and `Comparator`?', topic: 'Collections', expectedKeyPoints: ['Comparable defines natural ordering', 'Comparator provides custom ordering', 'compareTo() vs compare()'] },
        { question: 'What are Design Patterns? Explain Singleton and Factory patterns.', topic: 'Design Patterns', expectedKeyPoints: ['Singleton ensures single instance', 'Factory creates objects without specifying class', 'Use cases for each'] },
        { question: 'Explain garbage collection in Java. What are the different GC algorithms?', topic: 'JVM & Memory', expectedKeyPoints: ['Mark and sweep', 'Generational GC', 'G1, ZGC, Shenandoah', 'System.gc() and finalize()'] },
        { question: 'What is the difference between `wait()`, `sleep()`, and `yield()`?', topic: 'Concurrency', expectedKeyPoints: ['wait() releases lock', 'sleep() does not release lock', 'yield() gives chance to other threads'] },
      ],
      advanced: [
        { question: 'Explain the Java ClassLoader hierarchy and how class loading works.', topic: 'JVM Internals', expectedKeyPoints: ['Bootstrap, Extension, Application classloaders', 'Delegation model', 'Custom classloaders', 'ClassNotFoundException vs NoClassDefFoundError'] },
        { question: 'What are volatile and atomic variables? When would you use each?', topic: 'Concurrency', expectedKeyPoints: ['volatile ensures visibility', 'Atomic uses CAS operations', 'Memory barriers', 'Use cases for each'] },
        { question: 'Design a thread-safe producer-consumer system using Java.', topic: 'Concurrency', expectedKeyPoints: ['BlockingQueue', 'wait/notify pattern', 'Lock and Condition', 'Semaphore approach'] },
        { question: 'Explain the Java Memory Model happens-before relationship.', topic: 'JVM Internals', expectedKeyPoints: ['Program order rule', 'Monitor lock rule', 'Volatile variable rule', 'Thread start/join rules'] },
        { question: 'What is the difference between ConcurrentHashMap in Java 7 and Java 8?', topic: 'Collections', expectedKeyPoints: ['Segment locking vs CAS', 'Red-black tree for buckets', 'Size calculation', 'Compute methods'] },
        { question: 'Explain JIT compilation, AOT compilation, and GraalVM native images.', topic: 'JVM Performance', expectedKeyPoints: ['JIT compiles hot code', 'C1 and C2 compilers', 'GraalVM ahead-of-time', 'Trade-offs'] },
        { question: 'How does the Spring IoC container work? Explain bean lifecycle.', topic: 'Spring Framework', expectedKeyPoints: ['BeanFactory vs ApplicationContext', 'Bean scopes', 'Lifecycle callbacks', 'Dependency injection types'] },
        { question: 'Explain microservices patterns: Circuit Breaker, Saga, and CQRS.', topic: 'Architecture', expectedKeyPoints: ['Circuit Breaker prevents cascade failures', 'Saga handles distributed transactions', 'CQRS separates read/write models'] },
        { question: 'What are virtual threads in Java 21? How do they differ from platform threads?', topic: 'Java 21 Features', expectedKeyPoints: ['Lightweight threads', 'M:N threading model', 'Structured concurrency', 'Thread pinning issues'] },
        { question: 'Design a high-throughput caching system with Java.', topic: 'System Design', expectedKeyPoints: ['Cache invalidation strategies', 'Write-through vs write-behind', 'LRU/LFU eviction', 'Distributed caching with Redis'] },
      ]
    },
    'Python': {
      beginner: [
        { question: 'What are the differences between lists and tuples in Python?', topic: 'Python Basics', expectedKeyPoints: ['Lists are mutable', 'Tuples are immutable', 'Performance differences', 'Use cases'] },
        { question: 'Explain what a decorator is in Python.', topic: 'Python Concepts', expectedKeyPoints: ['Function that modifies another function', '@syntax', 'Common uses like @property, @staticmethod'] },
        { question: 'What is the difference between `is` and `==` in Python?', topic: 'Python Basics', expectedKeyPoints: ['is checks identity', '== checks equality', 'id() function', 'Integer caching'] },
        { question: 'Explain list comprehensions with an example.', topic: 'Python Basics', expectedKeyPoints: ['Concise syntax', 'Filtering with conditions', 'Nested comprehensions', 'Performance vs loops'] },
        { question: 'What are Python generators? When would you use them?', topic: 'Python Concepts', expectedKeyPoints: ['yield keyword', 'Lazy evaluation', 'Memory efficiency', 'Generator expressions'] },
        { question: 'What is the difference between `*args` and `**kwargs`?', topic: 'Python Basics', expectedKeyPoints: ['*args for positional arguments', '**kwargs for keyword arguments', 'Can be combined', 'Order in function definition'] },
        { question: 'Explain the concept of duck typing in Python.', topic: 'Python Concepts', expectedKeyPoints: ['If it walks like a duck...', 'No explicit type checking', 'Protocol-based', 'ABC module'] },
        { question: 'What are lambda functions? Give examples.', topic: 'Python Basics', expectedKeyPoints: ['Anonymous functions', 'Single expression', 'Used with map, filter, reduce', 'Limitations'] },
        { question: 'What is the difference between deep copy and shallow copy?', topic: 'Python Basics', expectedKeyPoints: ['Shallow copies nested references', 'Deep copies everything', 'copy module', 'Performance implications'] },
        { question: 'Explain exception handling in Python with try/except/else/finally.', topic: 'Error Handling', expectedKeyPoints: ['try/except/else/finally', 'Exception hierarchy', 'Custom exceptions', 'Context managers'] },
      ],
      intermediate: [
        { question: 'Explain the Python GIL (Global Interpreter Lock) and its impact.', topic: 'Python Internals', expectedKeyPoints: ['Only one thread executes Python bytecode', 'Impact on CPU-bound tasks', 'Workarounds: multiprocessing, C extensions'] },
        { question: 'What are metaclasses in Python? When would you use one?', topic: 'Advanced Python', expectedKeyPoints: ['Class of a class', '__metaclass__ attribute', 'Type as default metaclass', 'ORM frameworks use metaclasses'] },
        { question: 'Explain the difference between `__new__` and `__init__`.', topic: 'Advanced Python', expectedKeyPoints: ['__new__ creates the instance', '__init__ initializes it', 'Use cases for __new__', 'Singleton pattern'] },
        { question: 'What is contextlib? How do you create a custom context manager?', topic: 'Python Libraries', expectedKeyPoints: ['@contextmanager decorator', '__enter__ and __exit__', 'Database connections', 'File handling'] },
        { question: 'Explain async/await in Python. How does asyncio work?', topic: 'Async Programming', expectedKeyPoints: ['Event loop', 'Coroutines', 'Tasks and futures', 'aiohttp for async HTTP'] },
        { question: 'What are descriptors in Python?', topic: 'Advanced Python', expectedKeyPoints: ['__get__, __set__, __delete__', 'Property descriptors', 'Non-data descriptors', '@property implementation'] },
        { question: 'Explain the differences between `threading`, `multiprocessing`, and `asyncio`.', topic: 'Concurrency', expectedKeyPoints: ['GIL limitation for threads', 'True parallelism with multiprocessing', 'I/O-bound with asyncio', 'When to use each'] },
        { question: 'What are abstract base classes (ABCs) in Python?', topic: 'Python Concepts', expectedKeyPoints: ['abc module', 'ABCMeta', '@abstractmethod', 'Register subclass'] },
        { question: 'How does Python memory management work? Explain reference counting and garbage collection.', topic: 'Python Internals', expectedKeyPoints: ['Reference counting', 'Generational GC', 'Circular references', 'sys.getrefcount()'] },
        { question: 'Explain Python data model and operator overloading.', topic: 'Advanced Python', expectedKeyPoints: ['Magic/dunder methods', '__str__ vs __repr__', '__add__, __len__', '__getitem__'] },
      ],
      advanced: [
        { question: 'Explain CPython internals: bytecode, code objects, and the evaluation loop.', topic: 'Python Internals', expectedKeyPoints: ['Bytecode compilation', 'dis module', 'Frame objects', 'ceval.c evaluation loop'] },
        { question: 'How would you design a Python package for a large-scale application?', topic: 'Architecture', expectedKeyPoints: ['Package structure', 'Namespace packages', 'Entry points', 'Version management'] },
        { question: 'Explain the differences between WSGI, ASGI, and how Django/FastAPI use them.', topic: 'Web Architecture', expectedKeyPoints: ['WSGI is synchronous', 'ASGI is asynchronous', 'Django 4+ supports ASGI', 'FastAPI uses Starlette ASGI'] },
        { question: 'How do you profile and optimize Python code performance?', topic: 'Performance', expectedKeyPoints: ['cProfile, line_profiler', 'memory_profiler', 'NumPy vectorization', 'Cython for hot paths'] },
        { question: 'Explain Python decorators with arguments, class decorators, and stacking decorators.', topic: 'Advanced Python', expectedKeyPoints: ['Decorator factories', 'functools.wraps', 'Class as decorator', 'Order of execution'] },
        { question: 'Design a plugin architecture for a Python application.', topic: 'Architecture', expectedKeyPoints: ['Entry points', 'importlib for dynamic imports', 'Plugin discovery', 'Hook system'] },
        { question: 'What are the trade-offs between SQLAlchemy ORM vs raw SQL vs Django ORM?', topic: 'Database', expectedKeyPoints: ['Query generation', 'N+1 problem', 'Migration support', 'Performance tuning'] },
        { question: 'Explain Python type hints and mypy checking in production.', topic: 'Type Safety', expectedKeyPoints: ['PEP 484', 'TypeVar, Generic', 'Protocol for structural typing', 'mypy strict mode'] },
        { question: 'How does Python serialization work? Compare pickle, JSON, and protobuf.', topic: 'Data Formats', expectedKeyPoints: ['Pickle is Python-specific and insecure', 'JSON is universal but limited', 'Protobuf is efficient and typed', 'MessagePack as alternative'] },
        { question: 'Explain how to build a production-ready Python REST API with authentication, rate limiting, and monitoring.', topic: 'Production', expectedKeyPoints: ['JWT authentication', 'Rate limiting middleware', 'Prometheus metrics', 'Structured logging'] },
      ]
    },
    'JavaScript': {
      beginner: [
        { question: 'What is the difference between `var`, `let`, and `const`?', topic: 'JavaScript Basics', expectedKeyPoints: ['var is function-scoped', 'let is block-scoped', 'const cannot be reassigned', 'Hoisting behavior'] },
        { question: 'Explain closures in JavaScript with an example.', topic: 'JavaScript Concepts', expectedKeyPoints: ['Function remembers its scope', 'Access to outer variables', 'Common use cases', 'Memory implications'] },
        { question: 'What is the event loop in JavaScript?', topic: 'JavaScript Runtime', expectedKeyPoints: ['Call stack', 'Web APIs', 'Callback queue', 'Microtask queue'] },
        { question: 'What are promises? How do they differ from callbacks?', topic: 'Async JavaScript', expectedKeyPoints: ['Promise states: pending, fulfilled, rejected', '.then() and .catch()', 'Callback hell problem', 'Promise chaining'] },
        { question: 'Explain the difference between `==` and `===` in JavaScript.', topic: 'JavaScript Basics', expectedKeyPoints: ['== performs type coercion', '=== checks strict equality', 'When to use which', 'NaN === NaN is false'] },
        { question: 'What is `this` in JavaScript? How does its value get determined?', topic: 'JavaScript Concepts', expectedKeyPoints: ['Execution context', 'Implicit binding', 'Explicit binding (call, apply, bind)', 'Arrow functions'] },
        { question: 'What is the spread operator and rest parameter?', topic: 'JavaScript ES6+', expectedKeyPoints: ['... for spreading iterables', '... for collecting parameters', 'Array and object spreading', 'Shallow copy'] },
        { question: 'Explain template literals in JavaScript.', topic: 'JavaScript ES6+', expectedKeyPoints: ['Backtick syntax', 'Expression interpolation', 'Multi-line strings', 'Tagged templates'] },
        { question: 'What is the DOM? How do you select and modify elements?', topic: 'DOM Manipulation', expectedKeyPoints: ['Document Object Model', 'querySelector, getElementById', 'textContent, innerHTML', 'Event listeners'] },
        { question: 'What are arrow functions? How do they differ from regular functions?', topic: 'JavaScript ES6+', expectedKeyPoints: ['Concise syntax', 'No own `this`', 'Cannot be used as constructors', 'Implicit return'] },
      ],
      intermediate: [
        { question: 'Explain prototypal inheritance in JavaScript.', topic: 'JavaScript Internals', expectedKeyPoints: ['Prototype chain', '__proto__ vs prototype', 'Object.create()', 'ES6 classes are syntactic sugar'] },
        { question: 'What is the difference between `null`, `undefined`, and `undeclared`?', topic: 'JavaScript Basics', expectedKeyPoints: ['null is intentional absence', 'undefined is uninitialized', 'undeclared throws ReferenceError', 'typeof differences'] },
        { question: 'How does JavaScript garbage collection work?', topic: 'JavaScript Internals', expectedKeyPoints: ['Mark and sweep algorithm', 'Reference counting', 'Memory leaks', 'WeakRef and FinalizationRegistry'] },
        { question: 'Explain async/await and how it relates to promises.', topic: 'Async JavaScript', expectedKeyPoints: ['Syntactic sugar over promises', 'Error handling with try/catch', 'Parallel execution with Promise.all', 'Top-level await'] },
        { question: 'What are modules in JavaScript? Explain import/export.', topic: 'JavaScript Modules', expectedKeyPoints: ['ES modules vs CommonJS', 'Named vs default exports', 'Dynamic imports', 'Tree shaking'] },
        { question: 'Explain the difference between debouncing and throttling.', topic: 'Performance', expectedKeyPoints: ['Debounce waits for pause', 'Throttle limits execution rate', 'Use cases for each', 'Implementation patterns'] },
        { question: 'What are generators in JavaScript?', topic: 'JavaScript Concepts', expectedKeyPoints: ['function* syntax', 'yield keyword', 'Lazy evaluation', 'Iterator protocol'] },
        { question: 'How does the `Map` and `Set` data structure differ from plain objects?', topic: 'JavaScript ES6+', expectedKeyPoints: ['Map preserves insertion order', 'Any key type for Map', 'Set for unique values', 'Performance for frequent add/remove'] },
        { question: 'What is event delegation? Why is it useful?', topic: 'DOM Manipulation', expectedKeyPoints: ['Attach listener to parent', 'Event bubbling', 'performance benefits', 'Dynamic element support'] },
        { question: 'Explain the Fetch API and how to handle errors properly.', topic: 'Async JavaScript', expectedKeyPoints: ['Response.ok check', '.json() parsing', 'AbortController', 'AbortError handling'] },
      ],
      advanced: [
        { question: 'Explain the JavaScript engine compilation pipeline (V8 TurboFan).', topic: 'JavaScript Internals', expectedKeyPoints: ['Parsing to AST', 'Ignition interpreter', 'TurboFan compiler', 'Deoptimization'] },
        { question: 'How would you implement a reactive state management system from scratch?', topic: 'Architecture', expectedKeyPoints: ['Proxy or Object.defineProperty', 'Dependency tracking', 'Batch updates', 'Proxy vs Object.defineProperty'] },
        { question: 'What are Web Workers? How do they communicate with the main thread?', topic: 'Web APIs', expectedKeyPoints: ['postMessage API', 'Structured cloning', 'Transferable objects', 'Service Workers'] },
        { question: 'Explain the differences between microtasks and macrotasks.', topic: 'JavaScript Runtime', expectedKeyPoints: ['Microtasks: Promises, queueMicrotask', 'Macrotasks: setTimeout, setInterval', 'Execution order', 'requestAnimationFrame timing'] },
        { question: 'How do you prevent memory leaks in a single-page application?', topic: 'Performance', expectedKeyPoints: ['Event listener cleanup', 'WeakMap/WeakSet usage', 'Component unmounting', 'Detached DOM nodes'] },
        { question: 'Explain how JavaScript Proxy and Reflect API work.', topic: 'Advanced JavaScript', expectedKeyPoints: ['Meta-programming', ' traps (get, set, apply)', 'Reflect mirrors Proxy traps', 'Use cases: validation, logging'] },
        { question: 'How would you implement a custom Promise from scratch?', topic: 'Advanced JavaScript', expectedKeyPoints: ['State machine', 'resolve and reject handlers', 'then chaining', 'Microtask scheduling'] },
        { question: 'What are typed arrays in JavaScript and when would you use them?', topic: 'Web APIs', expectedKeyPoints: ['ArrayBuffer, DataView', 'Int32Array, Float32Array', 'WebGL and binary data', 'Performance benefits'] },
        { question: 'Explain the module resolution algorithm in Node.js.', topic: 'Node.js Internals', expectedKeyPoints: ['CommonJS require algorithm', 'ESM import resolution', 'node_modules hierarchy', 'Package.json exports field'] },
        { question: 'How do you design and implement a real-time WebSocket system with reconnection?', topic: 'System Design', expectedKeyPoints: ['WebSocket protocol', 'Heartbeat mechanism', 'Exponential backoff', 'Message queuing'] },
      ]
    },
    'React': {
      beginner: [
        { question: 'What is React? Explain its core concepts.', topic: 'React Basics', expectedKeyPoints: ['Component-based', 'Virtual DOM', 'JSX syntax', 'Unidirectional data flow'] },
        { question: 'What is the difference between state and props?', topic: 'React Basics', expectedKeyPoints: ['Props are read-only', 'State is mutable', 'Props passed from parent', 'State managed within component'] },
        { question: 'Explain the useEffect hook and its dependency array.', topic: 'React Hooks', expectedKeyPoints: ['Runs after render', 'Dependency array controls re-runs', 'Cleanup function', 'Empty array means run once'] },
        { question: 'What is JSX? How does it differ from HTML?', topic: 'React Basics', expectedKeyPoints: ['JavaScript XML syntax', 'className instead of class', 'Expression interpolation with {}', 'Must return single parent element'] },
        { question: 'How do you handle events in React?', topic: 'React Basics', expectedKeyPoints: ['Synthetic events', 'camelCase naming', 'Prevent default behavior', 'Event delegation'] },
        { question: 'What is the useState hook? Give examples.', topic: 'React Hooks', expectedKeyPoints: ['Returns [state, setter]', 'Initial state value', 'Functional updates', 'Object state spreading'] },
        { question: 'What are keys in React lists? Why are they important?', topic: 'React Basics', expectedKeyPoints: ['Help React identify changes', 'Should be unique', 'Use stable IDs not index', 'Performance optimization'] },
        { question: 'Explain conditional rendering in React.', topic: 'React Basics', expectedKeyPoints: ['Ternary operator', 'Logical && operator', 'Early return', 'Switch statements'] },
        { question: 'What is the virtual DOM and how does React use it?', topic: 'React Internals', expectedKeyPoints: ['Lightweight DOM copy', 'Diffing algorithm', 'Reconciliation', 'Batch updates'] },
        { question: 'How do you handle forms in React?', topic: 'React Basics', expectedKeyPoints: ['Controlled components', 'Uncontrolled components', 'useState for form values', 'Form submission handling'] },
      ],
      intermediate: [
        { question: 'Explain React component lifecycle methods.', topic: 'React Lifecycle', expectedKeyPoints: ['Mounting, Updating, Unmounting', 'componentDidMount, componentDidUpdate', 'useEffect as lifecycle replacement', 'Error boundaries'] },
        { question: 'What is the Context API? When would you use it?', topic: 'React State', expectedKeyPoints: ['Avoid prop drilling', 'createContext and useContext', 'Provider component', 'Performance considerations'] },
        { question: 'Explain custom hooks and give examples.', topic: 'React Hooks', expectedKeyPoints: ['Extract reusable logic', 'Start with "use" convention', 'Can use other hooks', 'useFetch, useLocalStorage examples'] },
        { question: 'What are React.memo, useMemo, and useCallback?', topic: 'Performance', expectedKeyPoints: ['React.memo for component memoization', 'useMemo for expensive calculations', 'useCallback for stable function references', 'When to use each'] },
        { question: 'How does React Router work? Explain nested routing.', topic: 'React Router', expectedKeyPoints: ['BrowserRouter, Routes, Route', 'useParams, useNavigate', 'Nested routes with Outlet', 'Dynamic routes'] },
        { question: 'Explain the useRef hook and its use cases.', topic: 'React Hooks', expectedKeyPoints: ['Mutable reference object', 'DOM element access', 'Persisting values between renders', 'Not triggering re-render'] },
        { question: 'What are error boundaries in React?', topic: 'React Lifecycle', expectedKeyPoints: ['Catch JavaScript errors', 'componentDidCatch', 'getDerivedStateFromError', 'Wrap components'] },
        { question: 'How do you handle side effects in React?', topic: 'React Patterns', expectedKeyPoints: ['useEffect for side effects', 'Cleanup functions', 'Abort controllers', 'Race conditions'] },
        { question: 'Explain the useReducer hook vs useState.', topic: 'React Hooks', expectedKeyPoints: ['Complex state logic', 'Dispatch actions', 'Reducer function', 'When to prefer one over the other'] },
        { question: 'What are React fragments? Why use them?', topic: 'React Basics', expectedKeyPoints: ['Group elements without wrapper', '<> shorthand syntax', 'No extra DOM nodes', 'Key prop with fragments'] },
      ],
      advanced: [
        { question: 'Explain React fiber architecture and concurrent features.', topic: 'React Internals', expectedKeyPoints: ['Fiber nodes', 'Priority scheduling', 'Suspense for data fetching', 'useTransition, useDeferredValue'] },
        { question: 'How would you implement server-side rendering (SSR) with React?', topic: 'SSR', expectedKeyPoints: ['Hydration process', 'Next.js as framework', 'Server components', 'SEO benefits'] },
        { question: 'Explain React Server Components and how they differ from client components.', topic: 'React 18+', expectedKeyPoints: ['Zero bundle size components', 'Server-only APIs access', 'Streaming and suspense', 'Composition model'] },
        { question: 'How do you test React components? Explain the testing pyramid.', topic: 'Testing', expectedKeyPoints: ['Unit tests with Jest', 'React Testing Library', 'Integration vs E2E tests', 'Mocking strategies'] },
        { question: 'Explain state management patterns: Redux, Zustand, and Jotai.', topic: 'State Management', expectedKeyPoints: ['Redux: single store, reducers', 'Zustand: minimal boilerplate', 'Jotai: atomic state', 'When to use each'] },
        { question: 'How do you optimize React performance at scale?', topic: 'Performance', expectedKeyPoints: ['Code splitting with lazy', 'Virtualization for long lists', 'Bundle analysis', 'Tree shaking'] },
        { question: 'Explain React Suspense and concurrent rendering patterns.', topic: 'React 18+', expectedKeyPoints: ['Suspense boundaries', 'fallback UI', 'SuspenseList', 'Concurrent features'] },
        { question: 'How would you design a micro-frontend architecture with React?', topic: 'Architecture', expectedKeyPoints: ['Module Federation', 'Single-SPA', 'Shared dependencies', 'Route-based splitting'] },
        { question: 'Explain the difference between controlled and uncontrolled components at scale.', topic: 'React Patterns', expectedKeyPoints: ['Form libraries (React Hook Form)', 'Performance implications', 'Testing considerations', 'When to use each'] },
        { question: 'How do you handle authentication in a React application?', topic: 'Security', expectedKeyPoints: ['JWT tokens', 'Protected routes', 'Refresh token strategy', 'OAuth integration'] },
      ]
    }
  },
  'Data Analyst': {
    'SQL': {
      beginner: [
        { question: 'What is the difference between INNER JOIN, LEFT JOIN, RIGHT JOIN, and FULL JOIN?', topic: 'SQL Joins', expectedKeyPoints: ['INNER JOIN matches both tables', 'LEFT JOIN keeps all left rows', 'RIGHT JOIN keeps all right rows', 'FULL JOIN keeps all rows'] },
        { question: 'What is the difference between WHERE and HAVING?', topic: 'SQL Basics', expectedKeyPoints: ['WHERE filters rows before GROUP BY', 'HAVING filters after GROUP BY', 'WHERE cannot use aggregate functions', 'HAVING can use aggregate functions'] },
        { question: 'Explain GROUP BY and aggregate functions.', topic: 'SQL Basics', expectedKeyPoints: ['GROUP BY groups rows', 'COUNT, SUM, AVG, MIN, MAX', 'Must select grouped columns', 'Multiple grouping columns'] },
        { question: 'What is a primary key and a foreign key?', topic: 'SQL Basics', expectedKeyPoints: ['Primary key uniquely identifies rows', 'Foreign key references another table', 'Primary key cannot be NULL', 'Foreign key enforces referential integrity'] },
        { question: 'What is a subquery? Give examples.', topic: 'SQL Basics', expectedKeyPoints: ['Query inside a query', 'Correlated vs non-correlated', 'WHERE IN subquery', 'FROM subquery (derived table)'] },
      ],
      intermediate: [
        { question: 'Explain window functions in SQL.', topic: 'SQL Advanced', expectedKeyPoints: ['ROW_NUMBER, RANK, DENSE_RANK', 'PARTITION BY clause', 'LAG and LEAD', 'Running totals'] },
        { question: 'What are CTEs (Common Table Expressions) and how do they differ from subqueries?', topic: 'SQL Advanced', expectedKeyPoints: ['WITH clause syntax', 'Readability improvement', 'Recursive CTEs', 'Performance considerations'] },
        { question: 'How do you optimize a slow SQL query?', topic: 'SQL Performance', expectedKeyPoints: ['EXPLAIN/EXPLAIN ANALYZE', 'Index usage', 'Avoid SELECT *', 'Query plan analysis'] },
        { question: 'What is normalization? Explain 1NF, 2NF, and 3NF.', topic: 'Database Design', expectedKeyPoints: ['1NF: atomic values', '2NF: no partial dependencies', '3NF: no transitive dependencies', 'Denormalization trade-offs'] },
      ],
      advanced: [
        { question: 'How do you handle large datasets efficiently in SQL?', topic: 'SQL Performance', expectedKeyPoints: ['Partitioning strategies', 'Materialized views', 'Batch processing', 'Index optimization'] },
        { question: 'Explain query execution plans and how to read them.', topic: 'SQL Performance', expectedKeyPoints: ['Seq Scan vs Index Scan', 'Hash Join vs Nested Loop', 'Cost estimation', 'Statistics'] },
      ]
    },
    'Python': {
      beginner: [
        { question: 'How do you load and explore a dataset in Python?', topic: 'Data Analysis', expectedKeyPoints: ['pandas read_csv', 'head(), info(), describe()', 'Shape and dtypes', 'Missing values check'] },
        { question: 'Explain data cleaning techniques in pandas.', topic: 'Data Cleaning', expectedKeyPoints: ['handle missing values', 'dropna vs fillna', 'data type conversion', 'duplicate removal'] },
      ],
      intermediate: [
        { question: 'How do you create visualizations with matplotlib and seaborn?', topic: 'Visualization', expectedKeyPoints: ['Line, bar, scatter plots', 'Seaborn statistical plots', 'Subplots', 'Customization'] },
        { question: 'Explain data aggregation and groupby operations.', topic: 'Data Analysis', expectedKeyPoints: ['groupby mechanics', 'Multiple aggregations', 'Pivot tables', 'Cross-tabulation'] },
      ],
      advanced: [
        { question: 'How would you build an end-to-end data pipeline?', topic: 'Data Engineering', expectedKeyPoints: ['ETL process', 'Data validation', 'Scheduling with Airflow', 'Monitoring and alerting'] },
      ]
    }
  }
};

// Add default questions for any role/tech combo not in the bank
const defaultQuestions = {
  beginner: [
    { question: 'What are the key concepts you would use in your daily work as this role?', topic: 'General Knowledge', expectedKeyPoints: ['Core concepts', 'Daily tools', 'Best practices'] },
    { question: 'Describe a project you have worked on and the technologies involved.', topic: 'Experience', expectedKeyPoints: ['Project description', 'Technologies used', 'Challenges faced'] },
    { question: 'What is version control and why is it important?', topic: 'Development Practices', expectedKeyPoints: ['Git basics', 'Branching', 'Collaboration'] },
    { question: 'How do you approach debugging a problem in your code?', topic: 'Problem Solving', expectedKeyPoints: ['Reproduce the issue', 'Use debugging tools', 'Isolate the problem'] },
    { question: 'What testing methodologies do you know?', topic: 'Testing', expectedKeyPoints: ['Unit testing', 'Integration testing', 'Test-driven development'] },
    { question: 'Explain the concept of API and how you have used it.', topic: 'Web Concepts', expectedKeyPoints: ['REST API basics', 'HTTP methods', 'Request/response cycle'] },
    { question: 'What is agile methodology? How do you work in a team?', topic: 'Teamwork', expectedKeyPoints: ['Scrum/Kanban', 'Sprints', 'Daily standups'] },
    { question: 'How do you handle deadlines and prioritize tasks?', topic: 'Soft Skills', expectedKeyPoints: ['Time management', 'Task prioritization', 'Communication'] },
    { question: 'What are the SOLID principles? Explain briefly.', topic: 'Design Principles', expectedKeyPoints: ['Single Responsibility', 'Open/Closed', 'Liskov Substitution'] },
    { question: 'Describe your experience with database systems.', topic: 'Databases', expectedKeyPoints: ['SQL vs NoSQL', 'Basic CRUD operations', 'Data modeling'] },
  ],
  intermediate: [
    { question: 'How do you ensure code quality in your projects?', topic: 'Best Practices', expectedKeyPoints: ['Code reviews', 'Linting', 'Documentation', 'Automated testing'] },
    { question: 'Explain a time you had to learn a new technology quickly.', topic: 'Adaptability', expectedKeyPoints: ['Learning approach', 'Resources used', 'Application'] },
    { question: 'How do you handle technical disagreements in a team?', topic: 'Soft Skills', expectedKeyPoints: ['Communication', 'Compromise', 'Data-driven decisions'] },
    { question: 'Describe the most complex technical challenge you have solved.', topic: 'Problem Solving', expectedKeyPoints: ['Problem description', 'Approach taken', 'Result'] },
    { question: 'How do you approach system design for a new feature?', topic: 'System Design', expectedKeyPoints: ['Requirements gathering', 'Trade-offs', 'Scalability considerations'] },
  ],
  advanced: [
    { question: 'How do you mentor junior developers?', topic: 'Leadership', expectedKeyPoints: ['Code review feedback', 'Knowledge sharing', 'Patience'] },
    { question: 'Describe your experience leading technical architecture decisions.', topic: 'Architecture', expectedKeyPoints: ['Decision process', 'Stakeholder communication', 'Outcome evaluation'] },
    { question: 'How do you stay current with technology trends?', topic: 'Continuous Learning', expectedKeyPoints: ['Industry blogs', 'Conferences', 'Side projects'] },
    { question: 'Explain a production incident you handled and the lessons learned.', topic: 'Incident Management', expectedKeyPoints: ['Incident response', 'Root cause analysis', 'Prevention measures'] },
    { question: 'How would you design a system to handle millions of users?', topic: 'System Design', expectedKeyPoints: ['Horizontal scaling', 'Load balancing', 'Caching strategies', 'Database sharding'] },
  ]
};

class QuestionBankService {
  getQuestion(config, previousQuestions = []) {
    const { jobRole, technology, difficulty, interviewType } = config;

    let questions = [];

    // Try to find questions in the bank
    if (questionBank[jobRole] && questionBank[jobRole][technology]) {
      const techQuestions = questionBank[jobRole][technology];
      questions = techQuestions[difficulty] || techQuestions['beginner'] || [];
    }

    // If not enough questions, use defaults
    if (questions.length === 0) {
      questions = defaultQuestions[difficulty] || defaultQuestions['beginner'];
    }

    // Filter out previously asked questions
    const available = questions.filter(q => !previousQuestions.includes(q.question));

    if (available.length === 0) {
      // If all questions exhausted, reuse with a variation
      return {
        question: questions[Math.floor(Math.random() * questions.length)].question + ' (Please provide a different perspective)',
        topic: 'Mixed Topics',
        expectedKeyPoints: [],
        difficulty
      };
    }

    const selected = available[Math.floor(Math.random() * available.length)];
    return {
      question: selected.question,
      topic: selected.topic,
      expectedKeyPoints: selected.expectedKeyPoints,
      difficulty
    };
  }

  evaluateAnswer(question, answer, config) {
    const answerLower = answer.toLowerCase();
    const wordCount = answer.split(/\s+/).length;

    let score = 5;
    let technicalAccuracy = 5;
    let depth = 5;
    let communication = 5;
    let completeness = 5;
    const strengths = [];
    const improvements = [];

    // Length-based scoring
    if (wordCount < 15) {
      score = 3;
      depth = 2;
      completeness = 3;
      improvements.push('Answer is too brief. Provide more detail and explanation.');
    } else if (wordCount < 50) {
      score = 5;
      depth = 4;
      improvements.push('Could provide more depth and specific examples.');
    } else if (wordCount >= 50 && wordCount < 150) {
      score = 7;
      depth = 7;
      strengths.push('Good level of detail in the answer.');
    } else {
      score = 8;
      depth = 8;
      completeness = 8;
      strengths.push('Comprehensive and detailed answer.');
    }

    // Communication scoring based on structure
    const hasStructure = answer.includes('\n') || answer.includes('.') || answer.includes(';');
    if (hasStructure) {
      communication = 7;
      strengths.push('Well-structured response.');
    } else {
      communication = 4;
      improvements.push('Try to structure your answer with clear sentences or bullet points.');
    }

    // Check for technical keywords (basic heuristic)
    const techWords = ['implementation', 'algorithm', 'function', 'variable', 'database', 'api', 'server', 'framework', 'pattern', 'architecture', 'performance', 'optimization', 'security', 'test', 'deploy', 'design', 'model', 'class', 'object', 'method', 'interface'];
    const techWordCount = techWords.filter(w => answerLower.includes(w)).length;
    if (techWordCount >= 4) {
      technicalAccuracy = 7;
      strengths.push('Good use of technical terminology.');
    } else if (techWordCount >= 2) {
      technicalAccuracy = 5;
    } else {
      technicalAccuracy = 3;
      improvements.push('Include more technical terminology relevant to the question.');
    }

    // Check for examples
    if (answerLower.includes('for example') || answerLower.includes('such as') || answerLower.includes('e.g.') || answerLower.includes('like ')) {
      strengths.push('Good use of examples to illustrate points.');
      completeness += 1;
    }

    // Calculate overall score
    score = Math.round(((technicalAccuracy * 0.3) + (depth * 0.25) + (communication * 0.2) + (completeness * 0.25)) * 10) / 10;
    score = Math.min(10, Math.max(1, score));

    if (strengths.length === 0) strengths.push('Attempted to answer the question.');
    if (improvements.length === 0) improvements.push('Continue developing your technical writing skills.');

    return {
      overallScore: score,
      technicalAccuracy: Math.min(10, Math.max(1, technicalAccuracy)),
      depth: Math.min(10, Math.max(1, depth)),
      communication: Math.min(10, Math.max(1, communication)),
      completeness: Math.min(10, Math.max(1, completeness)),
      strengths,
      improvements,
      feedback: `Your answer ${score >= 7 ? 'demonstrates good understanding' : score >= 5 ? 'shows a basic understanding but needs more detail' : 'needs significant improvement'}. ${score >= 7 ? 'You provided good technical detail and structure.' : 'Try to provide more specific details, examples, and technical depth in your responses.'}`
    };
  }

  generateReport(config, answers) {
    const scores = answers.map(a => a.evaluation?.overallScore || 5);
    const overallScore = Math.round((scores.reduce((a, b) => a + b, 0) / scores.length) * 10) / 10;

    const allStrengths = answers.flatMap(a => a.evaluation?.strengths || []);
    const allImprovements = answers.flatMap(a => a.evaluation?.improvements || []);

    const topStrengths = [...new Set(allStrengths)].slice(0, 4);
    const topImprovements = [...new Set(allImprovements)].slice(0, 4);

    const technicalScores = answers.map(a => a.evaluation?.technicalAccuracy || 5);
    const commScores = answers.map(a => a.evaluation?.communication || 5);
    const depthScores = answers.map(a => a.evaluation?.depth || 5);

    const technicalScore = Math.round((technicalScores.reduce((a, b) => a + b, 0) / technicalScores.length) * 10) / 10;
    const communicationScore = Math.round((commScores.reduce((a, b) => a + b, 0) / commScores.length) * 10) / 10;
    const problemSolvingScore = Math.round((depthScores.reduce((a, b) => a + b, 0) / depthScores.length) * 10) / 10;
    const confidenceLevel = Math.min(10, Math.round((overallScore * 0.7 + (answers.filter(a => a.timeSpent < 120).length / answers.length) * 3) * 10) / 10);

    let hiringRecommendation = 'maybe';
    if (overallScore >= 8) hiringRecommendation = 'strong_yes';
    else if (overallScore >= 6.5) hiringRecommendation = 'yes';
    else if (overallScore >= 4) hiringRecommendation = 'maybe';
    else hiringRecommendation = 'no';

    return {
      overallScore,
      technicalScore,
      communicationScore,
      problemSolvingScore,
      confidenceLevel,
      strengths: topStrengths.length > 0 ? topStrengths : ['Attempted all questions'],
      improvements: topImprovements.length > 0 ? topImprovements : ['Provide more detailed answers'],
      recommendedTopics: [config.technology, `${config.difficulty} level concepts`, `${config.jobRole} best practices`],
      summary: `The candidate completed ${answers.length} questions for the ${config.jobRole} role focusing on ${config.technology}. Overall score is ${overallScore}/10. ${overallScore >= 7 ? 'The candidate demonstrated solid understanding of the subject matter.' : overallScore >= 5 ? 'The candidate showed basic understanding but needs to deepen their knowledge.' : 'The candidate needs significant improvement in their technical knowledge.'} Communication skills rated ${communicationScore}/10. Recommended: ${hiringRecommendation.replace('_', ' ')}.`,
      hiringRecommendation
    };
  }
}

module.exports = new QuestionBankService();
