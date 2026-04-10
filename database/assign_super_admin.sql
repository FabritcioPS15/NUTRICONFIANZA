-- Asignar rol de super_admin al usuario con correo fabpsandoval@gmail.com
UPDATE profiles
SET role = 'super_admin'
WHERE email = 'fabpsandoval@gmail.com';

-- Verificar el cambio
SELECT id, email, full_name, role
FROM profiles
WHERE email = 'fabpsandoval@gmail.com';
