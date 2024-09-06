import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';
import { CategoryEntity } from './entities/category.entity';
import { UserEntity } from 'src/users/entities/user.entity';
import { Roles } from 'src/utility/common/user-roles.enum';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

describe('CategoriesController', () => {
  let controller: CategoriesController;
  let service: CategoriesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoriesController],
      providers: [
        {
          provide: CategoriesService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          }
        },
      ],
    }).compile();

    controller = module.get<CategoriesController>(CategoriesController);
    service = module.get<CategoriesService>(CategoriesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new category', async () => {
      const createCategoryDto: CreateCategoryDto = {
        title: 'Electronics',
        description: 'Phones'
      };
      const mockedUser: UserEntity = {
        id: 1,
        name: "Joshua Oni",
        email: "davidjoshua603@gmail.com",
        password: "12345",
        roles: [Roles.ADMIN],
        createdAt: new Date(),
        updatedAt: new Date(),
        category: [],
        products: [],
        reviews: [],
        orders: [],
      };

      const result = new CategoryEntity();

      jest.spyOn(service, 'create').mockResolvedValue(result);

      expect(await controller.create(createCategoryDto, mockedUser)).toBe(result);
      expect(service.create).toHaveBeenCalledWith(createCategoryDto, mockedUser);
    });
  });

  describe('findAll', () => {
    it('should return an array of categories', async () => {
      const result = [new CategoryEntity()];
      jest.spyOn(service, 'findAll').mockResolvedValue(result);

      expect(await controller.findAll()).toBe(result);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single category', async () => {
      const id = '1';
      const result = new CategoryEntity();
      jest.spyOn(service, 'findOne').mockResolvedValue(result);

      expect(await controller.findOne(id)).toBe(result);
      expect(service.findOne).toHaveBeenCalledWith(+id);
    });
  });

  describe('update', () => {
    it('should update a category', async () => {
      const id = '1';
      const updateCategoryDto: UpdateCategoryDto = {
        title: "Furniture",
        description: "Cedars from Lebanon"
      };
      const result = new CategoryEntity();
      jest.spyOn(service, 'update').mockResolvedValue(result);

      expect(await controller.update(id, updateCategoryDto)).toBe(result);
      expect(service.update).toHaveBeenCalledWith(+id, updateCategoryDto);
    });
  });
});
