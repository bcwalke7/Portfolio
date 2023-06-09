
import * as THREE from 'https://unpkg.com/three@0.151.3/build/three.module.js';
import { OrbitControls } from 'https://unpkg.com/three@0.151.3/examples/jsm/controls/OrbitControls.js';
// import * as dat from 'dat.gui';


// START THREE BACKGROUND
// const gui = new dat.GUI()
const world = {
    plane: {
        width: 500,
        height: 500,
        widthSegments: 55,
        heightSegments: 55,
    }
}
// gui.add(world.plane, 'width', 1, 500).onChange(generatePlane)
// gui.add(world.plane, 'height', 1, 500).onChange(generatePlane)
// gui.add(world.plane, 'widthSegments', 1, 100).onChange(generatePlane)
// gui.add(world.plane, 'heightSegments', 1, 100).onChange(generatePlane)

function generatePlane() {
    planeMesh.geometry.dispose()
    planeMesh.geometry = new THREE.PlaneGeometry(world.plane.width, world.plane.height, world.plane.widthSegments, world.plane.heightSegments)

    // Vertice position randomization
    const { array } = planeMesh.geometry.attributes.position
    const randomValues = []
    for (let i = 0; i < array.length; i++) {

        if (i % 3 === 0) {
            const x = array[i]
            const y = array[i + 1]
            const z = array[i + 2]

            array[i] = x + (Math.random() - 0.5) * 3
            array[i + 1] = y + (Math.random() - 0.5) * 3
            array[i + 2] = z + (Math.random() - 0.5) * 3
        }
        randomValues.push(Math.random() * Math.PI * 2)
    }
    planeMesh.geometry.attributes.position.randomValues = randomValues
    planeMesh.geometry.attributes.position.originalPosition = planeMesh.geometry.attributes.position.array


    const colors = []
    for (let i = 0; i < planeMesh.geometry.attributes.position.count; i++) {
        colors.push(.85, .32, .02)
    }

    planeMesh.geometry.setAttribute('color', new THREE.BufferAttribute(new Float32Array(colors), 3))
}

const raycaster = new THREE.Raycaster()
const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(75, innerWidth / innerHeight, 0.1, 1000)
const renderer = new THREE.WebGLRenderer()

renderer.setSize(innerWidth, innerHeight)
renderer.setPixelRatio(devicePixelRatio)
document.body.appendChild(renderer.domElement)

const controls = new OrbitControls(camera, renderer.domElement)
camera.position.z = 50;
controls.enableZoom = false;
controls.minPolarAngle = 1.19;
controls.maxPolarAngle = Math.PI * .62;
controls.minAzimuthAngle = -.15;
controls.maxAzimuthAngle = .15;


const planGeometry = new THREE.PlaneGeometry(world.plane.width, world.plane.height, world.plane.widthSegments, world.plane.heightSegments);
const planeMaterial = new THREE.
    MeshPhongMaterial({
        side: THREE.DoubleSide,
        flatShading: true,
        vertexColors: true,
    })
const planeMesh = new THREE.Mesh(planGeometry, planeMaterial)

scene.add(planeMesh)

generatePlane()


const light = new THREE.DirectionalLight(0xffffff, 1)
light.position.set(0, -1, 1)
scene.add(light)

const backLight = new THREE.DirectionalLight(0xffffff, 1)
backLight.position.set(0, 0, -1)
scene.add(backLight)

const mouse = {
    x: undefined,
    y: undefined
}


let frame = 0
function animate() {
    requestAnimationFrame(animate)

    renderer.render(scene, camera)
    raycaster.setFromCamera(mouse, camera)
    frame += 0.01
    const { array, originalPosition, randomValues } = planeMesh.geometry.attributes.position
    for (let i = 0; i < array.length; i += 3) {
        // x
        array[i] = originalPosition[i] + Math.cos(frame + randomValues[i]) * 0.007
        // y
        array[i + 1] = originalPosition[i + 1] + Math.sin(frame + randomValues[i + 1]) * 0.007
    }

    planeMesh.geometry.attributes.position.needsUpdate = true


    const intersects = raycaster.intersectObject(planeMesh)
    if (intersects.length > 0) {
        const { color } = intersects[0].object.geometry.attributes

        // vertice 1
        color.setX(intersects[0].face.a, 0.1)
        color.setY(intersects[0].face.a, 0.5)
        color.setZ(intersects[0].face.a, 1)
        // Vertice 2
        color.setX(intersects[0].face.b, 0.1)
        color.setY(intersects[0].face.b, 0.5)
        color.setZ(intersects[0].face.b, 1)
        // Vertice 3
        color.setX(intersects[0].face.c, 0.1)
        color.setY(intersects[0].face.c, 0.5)
        color.setZ(intersects[0].face.c, 1)

        intersects[0].object.geometry.attributes.color.needsUpdate = true

        const initialColor = {
            r: 0.85,
            g: 0.32,
            b: 0.02,
        }

        const hoverColor = {
            r: 0.95,
            g: 0.61,
            b: 0.31,
        }

        gsap.to(hoverColor, {
            r: initialColor.r,
            g: initialColor.g,
            b: initialColor.b,
            duration: 1,
            onUpdate: () => {
                // vertice 1
                color.setX(intersects[0].face.a, hoverColor.r)
                color.setY(intersects[0].face.a, hoverColor.g)
                color.setZ(intersects[0].face.a, hoverColor.b)

                // vertice 2
                color.setX(intersects[0].face.b, hoverColor.r)
                color.setY(intersects[0].face.b, hoverColor.g)
                color.setZ(intersects[0].face.b, hoverColor.b)

                // vertice 3
                color.setX(intersects[0].face.c, hoverColor.r)
                color.setY(intersects[0].face.c, hoverColor.g)
                color.setZ(intersects[0].face.c, hoverColor.b)
                color.needsUpdate = true
            }
        })
    }
}

animate()

addEventListener('mousemove', (event) => {
    mouse.x = (event.clientX / innerWidth) * 2 - 1
    mouse.y = -(event.clientY / innerHeight) * 2 + 1
})

addEventListener('resize', () => {
    camera.aspect = innerWidth / innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(innerWidth, innerHeight)
})

// END THREE BACKGROUND

$(document).ready(function () {
    let nav = $("nav");
    let line = $("<div />").addClass("line");

    line.appendTo(nav);

    let active = nav.find(".active");
    let pos = 0;
    let wid = 0;

    if (active.length) {
        pos = active.position().left;
        wid = active.width();
        line.css({
            left: pos,
            width: wid
        });
    }

    nav.find("ul li a").on("click", function (e) {
        e.preventDefault();
        let _this = $(this);
        if (!_this.parent().hasClass("active") && !nav.hasClass("animate")) {
            nav.addClass("animate");
            nav.find("ul li").removeClass("active");

            let position = _this.parent().position();
            let width = _this.parent().width();

            if (position.left >= pos) {
                line.animate(
                    {
                        width: position.left - pos + width
                    },
                    300,
                    function () {
                        line.animate(
                            {
                                width: width,
                                left: position.left
                            },
                            150,
                            function () {
                                nav.removeClass("animate");
                            }
                        );
                        _this.parent().addClass("active");
                    }
                );
            } else {
                line.animate(
                    {
                        left: position.left,
                        width: pos - position.left + wid
                    },
                    300,
                    function () {
                        line.animate(
                            {
                                width: width
                            },
                            150,
                            function () {
                                nav.removeClass("animate");
                            }
                        );
                        _this.parent().addClass("active");
                    }
                );
            }

            pos = position.left;
            wid = width;

            // Smooth scrolling when clicking on navigation links
            let target = _this.attr("href");
            $('html, body').animate({
                scrollTop: $(target).offset().top - 88
            }, 500);
        }
    });

    // Intersection Observer for smooth animation
    let options = {
        root: null,
        rootMargin: "-88px 0px 0px 0px",
        threshold: 0.2
    };

    let observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                let targetId = entry.target.getAttribute("id");
                nav.find("ul li").removeClass("active");
                $('a[href="#' + targetId + '"]').parent().addClass("active");

                pos = $('a[href="#' + targetId + '"]').position().left;
                wid = $('a[href="#' + targetId + '"]').width();

                line.animate(
                    {
                        width: wid,
                        left: pos
                    },
                    150
                );
            }
        });
    }, options);

    // Observe each section
    $("section").each(function () {
        observer.observe(this);
    });
});

// //end Nav Animate




document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();

        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});
// animate when in viewport

const langConts = document.querySelectorAll('.langCont');

const options = {
    root: null,
    rootMargin: '0px',
    threshold: 1
};

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('flip-animation');
        } else {
            entry.target.classList.remove('flip-animation');
        }
    });
}, options);

langConts.forEach(langCont => {
    observer.observe(langCont);
});

// end animate in viewport
