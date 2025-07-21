import { Test, TestingModule } from '@nestjs/testing';
import { AssignorService } from './assignor.service';
import { PrismaService } from 'src/prisma.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';

const mockAssignor = {
  id: '1',
  name: 'João Silva',
  document: '12345678900',
  email: 'joao@email.com',
  phone: '11999999999',
};

describe('AssignorService', () => {
  let service: AssignorService;
  let prisma: PrismaService;

  const prismaMock = {
    assignor: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      update: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AssignorService,
        { provide: PrismaService, useValue: prismaMock },
      ],
    }).compile();

    service = module.get<AssignorService>(AssignorService);
    prisma = module.get<PrismaService>(PrismaService);

    jest.clearAllMocks();
  });

  describe('create', () => {
    it('deve criar um assignor com sucesso', async () => {
      prismaMock.assignor.create.mockResolvedValue(mockAssignor);

      const result = await service.create({
        name: mockAssignor.name,
        document: mockAssignor.document,
        email: mockAssignor.email,
        phone: mockAssignor.phone,
      });

      expect(result).toEqual(mockAssignor);
      expect(prismaMock.assignor.create).toHaveBeenCalled();
    });

    it('deve lançar BadRequest se campos faltarem', async () => {
      await expect(
        service.create({
          name: '',
          email: '',
          document: '',
          phone: '',
        }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('findAll', () => {
    it('deve retornar lista de assignors', async () => {
      prismaMock.assignor.findMany.mockResolvedValue([mockAssignor]);

      const result = await service.findAll();
      expect(result).toEqual([mockAssignor]);
    });

    it('deve lançar NotFound se retornar vazio', async () => {
      prismaMock.assignor.findMany.mockResolvedValue(null);

      await expect(service.findAll()).rejects.toThrow(NotFoundException);
    });
  });

  describe('findOne', () => {
    it('deve retornar um assignor pelo ID', async () => {
      prismaMock.assignor.findUnique.mockResolvedValue(mockAssignor);

      const result = await service.findOne('1');
      expect(result).toEqual(mockAssignor);
    });

    it('deve lançar NotFoundException se não encontrar', async () => {
      prismaMock.assignor.findUnique.mockResolvedValue(null);

      await expect(service.findOne('2')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('deve atualizar um assignor', async () => {
      prismaMock.assignor.findFirst.mockResolvedValue(mockAssignor);
      prismaMock.assignor.update.mockResolvedValue({
        ...mockAssignor,
        name: 'Novo Nome',
      });

      const result = await service.update('1', {
        name: 'Novo Nome',
        email: mockAssignor.email,
        document: mockAssignor.document,
        phone: mockAssignor.phone,
      });

      expect(result.name).toBe('Novo Nome');
    });

    it('deve lançar NotFoundException se assignor não existir', async () => {
      prismaMock.assignor.findFirst.mockResolvedValue(null);

      await expect(
        service.update('3', {
          name: 'x',
          email: 'x',
          document: 'x',
          phone: 'x',
        }),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
